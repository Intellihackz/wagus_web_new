import { chatService } from '@/services/chatService';
import { userService } from '@/services/userService';

// Sample users to create
const sampleUsers = [
  {
    wallet: '5FxB2wZFthgXz1CM7m6DKoSV8X88rQyUfT42HMbSVqGc',
    username: 'Gideon',
    tier: 'Adventurer'
  },
  {
    wallet: 'D8b3mn5swAB2GFYFntyzFPx66NJ4cetjEUZhJFb2qe8W',
    username: 'Alice',
    tier: 'Basic'
  },
  {
    wallet: '7yK9Rt2mLdVxZmWt3QaB5pYnHgFx8rCvWe1DsAc3NuPq',
    username: 'Bob',
    tier: 'Adventurer'
  }
];

// Sample messages to create
const sampleMessages = [
  {
    sender: '5FxB2wZFthgXz1CM7m6DKoSV8X88rQyUfT42HMbSVqGc',
    username: 'Gideon',
    message: 'GM family',
    room: 'General',
    tier: 'Adventurer'
  },
  {
    sender: 'D8b3mn5swAB2GFYFntyzFPx66NJ4cetjEUZhJFb2qe8W',
    username: 'Alice',
    message: 'Good morning! How is everyone doing today?',
    room: 'General',
    tier: 'Basic'
  },
  {
    sender: '7yK9Rt2mLdVxZmWt3QaB5pYnHgFx8rCvWe1DsAc3NuPq',
    username: 'Bob',
    message: 'Great to see the chat working!',
    room: 'General',
    tier: 'Adventurer'
  },
  {
    sender: '5FxB2wZFthgXz1CM7m6DKoSV8X88rQyUfT42HMbSVqGc',
    username: 'Gideon',
    message: 'Anyone interested in the new NFT drops?',
    room: 'NFTs',
    tier: 'Adventurer'
  },
  {
    sender: 'D8b3mn5swAB2GFYFntyzFPx66NJ4cetjEUZhJFb2qe8W',
    username: 'Alice',
    message: 'I am looking into some gaming tokens',
    room: 'Gaming',
    tier: 'Basic'
  }
];

export async function seedFirebaseData() {
  console.log('🌱 Starting Firebase data seeding...');
  
  try {
    // Create sample users
    console.log('Creating sample users...');
    for (const userData of sampleUsers) {
      try {
        await userService.handleUserLogin(userData.wallet, {
          username: userData.username,
          tier: userData.tier
        });
        console.log(`✅ Created user: ${userData.username} (${userData.wallet})`);
      } catch (error) {
        console.log(`⚠️  User ${userData.username} might already exist:`, error);
      }
    }

    // Add some delay to ensure users are created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create sample messages
    console.log('Creating sample messages...');
    for (const messageData of sampleMessages) {
      try {
        await chatService.sendMessage(messageData);
        console.log(`✅ Created message in ${messageData.room}: "${messageData.message.substring(0, 30)}..."`);
      } catch (error) {
        console.error(`❌ Failed to create message:`, error);
      }
    }

    // Add some likes to messages
    console.log('Adding sample likes...');
    try {
      // Get messages to like
      const generalMessages = await chatService.getRoomMessages('General', 10);
      
      if (generalMessages.length > 0) {
        // Like the first message with different users
        const firstMessage = generalMessages[0];
        if (firstMessage.id) {
          await chatService.likeMessage(firstMessage.id, sampleUsers[1].wallet);
          await chatService.likeMessage(firstMessage.id, sampleUsers[2].wallet);
          console.log('✅ Added likes to sample messages');
        }
      }
    } catch (error) {
      console.error('❌ Failed to add likes:', error);
    }

    console.log('🎉 Firebase data seeding completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${sampleUsers.length} users`);
    console.log(`- ${sampleMessages.length} messages across different rooms`);
    console.log('- Sample likes on messages');
    
  } catch (error) {
    console.error('❌ Firebase seeding failed:', error);
    throw error;
  }
}

// Run directly if this file is executed
if (require.main === module) {
  seedFirebaseData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}