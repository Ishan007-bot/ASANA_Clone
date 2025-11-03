import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  console.log('✅ Created user:', user.id);

  // Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'My Workspace',
    },
  });
  console.log('✅ Created workspace:', workspace.id);

  // Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Test Project',
      description: 'A test project',
      workspaceId: workspace.id,
    },
  });
  console.log('✅ Created project:', project.id);

  // Create Section
  const section = await prisma.section.create({
    data: {
      name: 'To Do',
      projectId: project.id,
      position: 0,
    },
  });
  console.log('✅ Created section:', section.id);

  // Create Task
  const task = await prisma.task.create({
    data: {
      name: 'Sample Task',
      description: 'This is a sample task',
      projectId: project.id,
      sectionId: section.id,
      assigneeId: user.id,
      priority: 'high',
      tags: ['important', 'urgent'],
      position: 0,
    },
  });
  console.log('✅ Created task:', task.id);

  console.log('\n📋 PROJECT ID FOR TESTING:', project.id);
  console.log('Copy this ID to use in Postman for GET /api/projects/:id\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



