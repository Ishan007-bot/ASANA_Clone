import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const USERS_TO_CREATE = 50;
const PROJECTS_TO_CREATE = 20;
const TASKS_PER_SECTION_MIN = 10;
const TASKS_PER_SECTION_MAX = 20;
const COMMENTS_TASK_COUNT = 150; // Number of tasks that will get comments
const COMMENTS_PER_TASK_MIN = 2;
const COMMENTS_PER_TASK_MAX = 10;

// Engineering task name generators
const getEngineeringTaskName = () => {
  const verbs = ['Refactor', 'Optimize', 'Implement', 'Fix', 'Deploy', 'Test', 'Review', 'Migrate', 'Integrate', 'Build'];
  const nouns = ['API endpoint', 'database query', 'authentication flow', 'UI component', 'websocket handler', 'caching layer', 'error handler', 'middleware', 'service', 'utility function'];
  return `${faker.helpers.arrayElement(verbs)} the ${faker.helpers.arrayElement(nouns)}`;
};

// Marketing task name generators
const getMarketingTaskName = () => {
  const actions = ['Draft', 'Create', 'Design', 'Launch', 'Analyze', 'Optimize', 'Schedule', 'Review', 'Update', 'A/B test'];
  const assets = ['social media campaign', 'email newsletter', 'blog post', 'landing page', 'ad copy', 'content calendar', 'SEO strategy', 'brand guidelines', 'press release', 'case study'];
  return `${faker.helpers.arrayElement(actions)} ${faker.company.buzzNoun()} ${faker.helpers.arrayElement(assets)}`;
};

// Helper to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper to get random elements from array
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Wipe database in correct order to avoid foreign key errors
async function wipeDatabase() {
  console.log('🧹 Wiping existing data...');
  
  await prisma.commentReaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.section.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database wiped clean');
}

// Create 50 realistic users
async function createUsers() {
  console.log(`\n👥 Creating ${USERS_TO_CREATE} users...`);
  const users = [];
  const usedEmails = new Set();

  // Create a test user first with known credentials
  const testPasswordHash = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: faker.image.avatar(),
      initials: 'TU',
      passwordHash: testPasswordHash,
      theme: 'dark',
      notificationPreferences: {
        email: true,
        push: true,
        taskAssigned: true,
        taskCompleted: true,
      },
    },
  });
  users.push(testUser);
  usedEmails.add('test@example.com');
  console.log('  ✅ Created test user: test@example.com / password123');

  // Create remaining users
  for (let i = 1; i < USERS_TO_CREATE; i++) {
    let email;
    do {
      email = faker.internet.email();
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const name = faker.person.fullName();
    // Use a common password for all test users, properly hashed
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl: faker.image.avatar(),
        initials: getInitials(name),
        passwordHash: passwordHash,
        theme: faker.helpers.arrayElement(['dark', 'light']),
        notificationPreferences: {
          email: faker.datatype.boolean(),
          push: faker.datatype.boolean(),
          taskAssigned: true,
          taskCompleted: faker.datatype.boolean(),
        },
      },
    });
    users.push(user);
    
    if ((i + 1) % 10 === 0) {
      console.log(`  ✅ Created ${i + 1}/${USERS_TO_CREATE} users...`);
    }
  }

  console.log(`✅ Created ${users.length} users (including test@example.com)`);
  console.log('   📝 All users have password: password123');
  return users;
}

// Create 3-5 realistic workspaces
async function createWorkspaces() {
  console.log('\n🏢 Creating workspaces...');
  const workspaceNames = [
    'Acme Corporation',
    'Project Phoenix',
    'Marketing Department',
    'Engineering Hub',
    'Product Innovation Lab'
  ];

  const workspaces = [];
  for (const name of workspaceNames) {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description: faker.company.catchPhrase(),
      },
    });
    workspaces.push(workspace);
  }

  console.log(`✅ Created ${workspaces.length} workspaces`);
  return workspaces;
}

// Create teams for each workspace
async function createTeams(workspaces, users) {
  console.log('\n👥 Creating teams...');
  const teams = [];

  const teamTypes = ['Engineering', 'Marketing', 'Product', 'Design', 'Sales', 'Operations'];
  
  for (const workspace of workspaces) {
    // Create 2-4 teams per workspace
    const teamsPerWorkspace = faker.number.int({ min: 2, max: 4 });
    
    for (let i = 0; i < teamsPerWorkspace; i++) {
      const teamType = faker.helpers.arrayElement(teamTypes);
      const teamName = `${teamType} Team - ${workspace.name}`;
      
      const team = await prisma.team.create({
        data: {
          name: teamName,
          description: faker.company.buzzPhrase(),
          workspaceId: workspace.id,
        },
      });

      // Add 5-15 members to each team
      const membersCount = faker.number.int({ min: 5, max: 15 });
      const selectedUsers = getRandomElements(users, membersCount);
      
      for (const user of selectedUsers) {
        await prisma.teamMember.create({
          data: {
            teamId: team.id,
            userId: user.id,
            role: faker.helpers.arrayElement(['member', 'admin', 'viewer']),
          },
        });
      }
      
      teams.push(team);
    }
  }

  console.log(`✅ Created ${teams.length} teams`);
  return teams;
}

// Create projects with tasks (The Most Important Part)
async function createProjectsAndTasks(workspaces, teams, users) {
  console.log(`\n📋 Creating ${PROJECTS_TO_CREATE} projects with tasks...`);
  const allProjects = [];
  const allTasks = [];

  // Engineering sections template
  const engineeringSections = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];
  
  // Marketing sections template
  const marketingSections = ['Planning', 'Creative Dev', 'In Review', 'Launched'];

  for (let i = 0; i < PROJECTS_TO_CREATE; i++) {
    const teamType = faker.helpers.arrayElement(['engineering', 'marketing']);
    const workspace = faker.helpers.arrayElement(workspaces);
    const team = faker.helpers.arrayElement(teams.filter(t => t.workspaceId === workspace.id));
    
    // Project name based on type
    const projectName = teamType === 'engineering'
      ? `${faker.commerce.productName()} App`
      : `${faker.company.catchPhrase()} Campaign`;

    // Create project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: faker.lorem.paragraph(),
        workspaceId: workspace.id,
        teamId: team.id,
        ownerId: faker.helpers.arrayElement(users).id,
        color: faker.color.rgb({ prefix: '#' }),
        icon: faker.helpers.arrayElement(['📱', '🚀', '💼', '🎯', '⚡', '🎨', '🔧', '📊']),
        viewType: faker.helpers.arrayElement(['list', 'board', 'timeline']),
      },
    });

    // Add 5-12 project members
    const projectMembersCount = faker.number.int({ min: 5, max: 12 });
    const selectedProjectMembers = getRandomElements(users, projectMembersCount);
    for (const user of selectedProjectMembers) {
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: user.id,
          role: faker.helpers.arrayElement(['member', 'admin', 'viewer']),
        },
      });
    }

    // Create sections based on type
    const sections = teamType === 'engineering' ? engineeringSections : marketingSections;
    const createdSections = [];

    for (let pos = 0; pos < sections.length; pos++) {
      const section = await prisma.section.create({
        data: {
          name: sections[pos],
          projectId: project.id,
          position: pos,
        },
      });
      createdSections.push(section);

      // Create tasks for this section
      const tasksCount = faker.number.int({ 
        min: TASKS_PER_SECTION_MIN, 
        max: TASKS_PER_SECTION_MAX 
      });

      for (let taskPos = 0; taskPos < tasksCount; taskPos++) {
        const isCompleted = pos === sections.length - 1 || (pos >= sections.length - 2 && faker.datatype.boolean({ probability: 0.7 }));
        
        // Realistic due dates - mix of past, present, and future
        const dueDateOption = faker.helpers.arrayElement(['past', 'near_future', 'far_future', 'none']);
        let dueDate = null;
        if (dueDateOption !== 'none') {
          if (dueDateOption === 'past') {
            dueDate = faker.date.past({ years: 1 });
          } else if (dueDateOption === 'near_future') {
            dueDate = faker.date.future({ days: 30 });
          } else {
            dueDate = faker.date.future({ years: 1 });
          }
        }

        const taskName = teamType === 'engineering'
          ? getEngineeringTaskName()
          : getMarketingTaskName();

        const priority = faker.helpers.arrayElement(['low', 'medium', 'high']);
        const tags = faker.helpers.arrayElements(
          ['urgent', 'important', 'bug', 'feature', 'enhancement', 'hotfix', 'design', 'backend', 'frontend', 'api'],
          { min: 0, max: 3 }
        );

        const assignee = faker.helpers.arrayElement(users);
        const creator = faker.helpers.arrayElement(users);

        const task = await prisma.task.create({
          data: {
            name: taskName,
            description: faker.lorem.paragraphs(2),
            projectId: project.id,
            sectionId: section.id,
            assigneeId: assignee.id,
            creatorId: creator.id,
            completed: isCompleted,
            dueDate: dueDate,
            priority: priority,
            tags: tags,
            position: taskPos,
            completedAt: isCompleted ? faker.date.past({ days: 30 }) : null,
            completedBy: isCompleted ? faker.helpers.arrayElement(users).id : null,
          },
        });

        allTasks.push(task);

        // Create activity logs for realistic task lifecycle
        const activityTypes = ['created', 'assigned', 'updated'];
        if (isCompleted) {
          activityTypes.push('completed');
        }

        // Create 2-5 activity logs per task
        const activityCount = faker.number.int({ min: 2, max: 5 });
        const selectedActivities = faker.helpers.arrayElements(activityTypes, { min: 1, max: activityCount });
        
        for (const activityType of selectedActivities) {
          await prisma.activityLog.create({
            data: {
              taskId: task.id,
              userId: faker.helpers.arrayElement(users).id,
              actionType: activityType,
              actionDetails: activityType === 'assigned' 
                ? { assigneeId: assignee.id, assigneeName: assignee.name }
                : activityType === 'updated'
                ? { field: faker.helpers.arrayElement(['name', 'description', 'priority', 'dueDate']), value: 'updated' }
                : {},
            },
          });
        }

        // 10% chance to create subtasks
        if (faker.datatype.boolean({ probability: 0.1 })) {
          const subtaskCount = faker.number.int({ min: 2, max: 4 });
          for (let s = 0; s < subtaskCount; s++) {
            await prisma.task.create({
              data: {
                name: `Subtask: ${faker.hacker.verb()} ${faker.hacker.noun()}`,
                description: faker.lorem.sentence(),
                projectId: project.id,
                sectionId: section.id,
                parentTaskId: task.id,
                assigneeId: faker.helpers.maybe(() => faker.helpers.arrayElement(users).id, { probability: 0.7 }),
                creatorId: creator.id,
                completed: faker.datatype.boolean({ probability: 0.4 }),
                priority: priority,
                position: s,
              },
            });
          }
        }
      }
    }

    allProjects.push(project);
    
    if ((i + 1) % 5 === 0) {
      console.log(`  ✅ Created ${i + 1}/${PROJECTS_TO_CREATE} projects...`);
    }
  }

  console.log(`✅ Created ${allProjects.length} projects with ${allTasks.length} tasks`);
  return { projects: allProjects, tasks: allTasks };
}

// Create comments (The "Chatter")
async function createComments(tasks, users) {
  console.log(`\n💬 Creating comments on tasks...`);
  
  // Select random tasks to receive comments
  const tasksToComment = getRandomElements(tasks, Math.min(COMMENTS_TASK_COUNT, tasks.length));
  let totalComments = 0;

  for (const task of tasksToComment) {
    const commentCount = faker.number.int({ 
      min: COMMENTS_PER_TASK_MIN, 
      max: COMMENTS_PER_TASK_MAX 
    });

    for (let i = 0; i < commentCount; i++) {
      const comment = await prisma.comment.create({
        data: {
          taskId: task.id,
          userId: faker.helpers.arrayElement(users).id,
          content: faker.lorem.paragraph(),
        },
      });

      totalComments++;

      // 20% chance for comment replies (nested comments)
      if (faker.datatype.boolean({ probability: 0.2 })) {
        await prisma.comment.create({
          data: {
            taskId: task.id,
            userId: faker.helpers.arrayElement(users).id,
            parentCommentId: comment.id,
            content: faker.lorem.sentence(),
          },
        });
        totalComments++;
      }

      // 30% chance for comment reactions
      if (faker.datatype.boolean({ probability: 0.3 })) {
        const emojis = ['👍', '❤️', '🎉', '🔥', '👏', '✅', '💡'];
        const reactingUsers = getRandomElements(users, faker.number.int({ min: 1, max: 3 }));
        
        for (const user of reactingUsers) {
          await prisma.commentReaction.create({
            data: {
              commentId: comment.id,
              userId: user.id,
              emoji: faker.helpers.arrayElement(emojis),
            },
          });
        }
      }
    }
  }

  console.log(`✅ Created ${totalComments} comments with reactions`);
}

// Test database connection with retry logic
async function testConnection() {
  console.log('🔍 Testing database connection...');
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful!\n');
      return true;
    } catch (error) {
      if (attempt < maxRetries) {
        console.log(`   Attempt ${attempt} failed, retrying in ${retryDelay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      console.error('❌ Database connection failed after', maxRetries, 'attempts:', error.message);
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Check if your Supabase database is active (not paused)');
      console.error('   2. Verify your DATABASE_URL in .env file');
      console.error('   3. Ensure you\'re using the direct connection (port 5432)');
      console.error('   4. Check if your password needs URL encoding (@ = %40, # = %23)');
      console.error('   5. The DATABASE_URL should look like:');
      console.error('      postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres\n');
      return false;
    }
  }
  return false;
}

// Main function
async function main() {
  console.log('🌱 Starting high-fidelity database seed...\n');
  const startTime = Date.now();

  try {
    // Step 0: Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Cannot proceed without database connection');
    }

    // Step 1: Wipe database
    await wipeDatabase();

    // Step 2: Create users
    const users = await createUsers();

    // Step 3: Create workspaces
    const workspaces = await createWorkspaces();

    // Step 4: Create teams
    const teams = await createTeams(workspaces, users);

    // Step 5: Create projects and tasks
    const { projects, tasks } = await createProjectsAndTasks(workspaces, teams, users);

    // Step 6: Create comments (The "Chatter")
    await createComments(tasks, users);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('✅ SEED COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📊 Statistics:`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🏢 Workspaces: ${workspaces.length}`);
    console.log(`   👥 Teams: ${teams.length}`);
    console.log(`   📋 Projects: ${projects.length}`);
    console.log(`   ✅ Tasks: ${tasks.length}`);
    console.log(`   💬 Comments: (see above)`);
    console.log(`   ⏱️  Time taken: ${duration}s`);
    console.log('\n🎉 Your database is now populated with realistic, high-fidelity data!');
    console.log('🚀 Ready for reinforcement learning environment!\n');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

