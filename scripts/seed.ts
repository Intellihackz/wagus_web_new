#!/usr/bin/env tsx

// Import the seeding function
import { seedFirebaseData } from '../src/utils/seedFirebase';

async function main() {
  console.log('🚀 Starting Firebase database seeding...');
  
  try {
    await seedFirebaseData();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
main();