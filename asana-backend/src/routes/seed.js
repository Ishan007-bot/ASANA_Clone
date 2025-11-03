import express from 'express';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Disable authentication for seed endpoint (development only)

const router = express.Router();
const prisma = new PrismaClient();

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

const getEngineeringTaskName = () => {
  const verbs = ['Refactor', 'Optimize', 'Implement', 'Fix', 'Deploy', 'Test', 'Review', 'Migrate', 'Integrate', 'Build'];
  const nouns = ['API endpoint', 'database query', 'authentication flow', 'UI component', 'websocket handler', 'caching layer', 'error handler', 'middleware', 'service', 'utility function'];
  return `${faker.helpers.arrayElement(verbs)} the ${faker.helpers.arrayElement(nouns)}`;
};

const getMarketingTaskName = () => {
  const actions = ['Draft', 'Create', 'Design', 'Launch', 'Analyze', 'Optimize', 'Schedule', 'Review', 'Update', 'A/B test'];
  const assets = ['social media campaign', 'email newsletter', 'blog post', 'landing page', 'ad copy', 'content calendar', 'SEO strategy', 'brand guidelines', 'press release', 'case study'];
  return `${faker.helpers.arrayElement(actions)} ${faker.company.buzzNoun()} ${faker.helpers.arrayElement(assets)}`;
};

// Seed endpoint - POST /api/seed
router.post('/', async (req, res) => {
  try {
    console.log('🌱 Starting seed via API...');
    
    // Wipe database
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

    // Create users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const name = faker.person.fullName();
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name,
          avatarUrl: faker.image.avatar(),
          initials: getInitials(name),
          passwordHash: faker.internet.password(),
          theme: faker.helpers.arrayElement(['dark', 'light']),
        },
      });
      users.push(user);
    }

    // Create workspaces
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
        data: { name, description: faker.company.catchPhrase() },
      });
      workspaces.push(workspace);
    }

    // Create teams
    const teams = [];
    const teamTypes = ['Engineering', 'Marketing', 'Product', 'Design', 'Sales', 'Operations'];
    for (const workspace of workspaces) {
      const teamsPerWorkspace = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < teamsPerWorkspace; i++) {
        const teamType = faker.helpers.arrayElement(teamTypes);
        const team = await prisma.team.create({
          data: {
            name: `${teamType} Team - ${workspace.name}`,
            description: faker.company.buzzPhrase(),
            workspaceId: workspace.id,
          },
        });
        
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

    // Create projects and tasks
    const allTasks = [];
    const engineeringSections = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];
    const marketingSections = ['Planning', 'Creative Dev', 'In Review', 'Launched'];

    for (let i = 0; i < 20; i++) {
      const teamType = faker.helpers.arrayElement(['engineering', 'marketing']);
      const workspace = faker.helpers.arrayElement(workspaces);
      const team = faker.helpers.arrayElement(teams.filter(t => t.workspaceId === workspace.id));
      
      const projectName = teamType === 'engineering'
        ? `${faker.commerce.productName()} App`
        : `${faker.company.catchPhrase()} Campaign`;

      const project = await prisma.project.create({
        data: {
          name: projectName,
          description: faker.lorem.paragraph(),
          workspaceId: workspace.id,
          teamId: team.id,
          ownerId: faker.helpers.arrayElement(users).id,
          color: faker.color.rgb({ prefix: '#' }),
          icon: faker.helpers.arrayElement(['📱', '🚀', '💼', '🎯', '⚡', '🎨', '🔧', '📊']),
        },
      });

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

      const sections = teamType === 'engineering' ? engineeringSections : marketingSections;
      for (let pos = 0; pos < sections.length; pos++) {
        const section = await prisma.section.create({
          data: {
            name: sections[pos],
            projectId: project.id,
            position: pos,
          },
        });

        const tasksCount = faker.number.int({ min: 10, max: 20 });
        for (let taskPos = 0; taskPos < tasksCount; taskPos++) {
          const isCompleted = pos === sections.length - 1 || (pos >= sections.length - 2 && faker.datatype.boolean({ probability: 0.7 }));
          
          const dueDateOption = faker.helpers.arrayElement(['past', 'near_future', 'far_future', 'none']);
          let dueDate = null;
          if (dueDateOption === 'past') {
            dueDate = faker.date.past({ years: 1 });
          } else if (dueDateOption === 'near_future') {
            dueDate = faker.date.future({ days: 30 });
          } else if (dueDateOption === 'far_future') {
            dueDate = faker.date.future({ years: 1 });
          }

          const taskName = teamType === 'engineering'
            ? getEngineeringTaskName()
            : getMarketingTaskName();

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
              priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
              tags: faker.helpers.arrayElements(
                ['urgent', 'important', 'bug', 'feature', 'enhancement'],
                { min: 0, max: 3 }
              ),
              position: taskPos,
              completedAt: isCompleted ? faker.date.past({ days: 30 }) : null,
              completedBy: isCompleted ? faker.helpers.arrayElement(users).id : null,
            },
          });

          allTasks.push(task);
        }
      }
    }

    // Create comments
    const tasksToComment = getRandomElements(allTasks, Math.min(150, allTasks.length));
    for (const task of tasksToComment) {
      const commentCount = faker.number.int({ min: 2, max: 10 });
      for (let i = 0; i < commentCount; i++) {
        await prisma.comment.create({
          data: {
            taskId: task.id,
            userId: faker.helpers.arrayElement(users).id,
            content: faker.lorem.paragraph(),
          },
        });
      }
    }

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        users: users.length,
        workspaces: workspaces.length,
        teams: teams.length,
        projects: 20,
        tasks: allTasks.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to seed database',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

export default router;

