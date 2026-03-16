import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function analyzeImage(imagePath, question) {
  try {
    const zai = await ZAI.create();
    
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

const images = [
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٠١٢٢_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧١٧٣٧_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٢٧٤٥_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٤٤٢٣_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٥٢٣٨_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٥_٢٣٢٣٠٢_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٥_٢٣٢٣٤٨_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٥_٢٣٣٦٠٨_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٦_٠٠٠٧٣٧_com_android_chrome_ChromeTabbedActivity.jpg',
  '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٦_٠٠٥١٥٠_com_android_chrome_ChromeTabbedActivity.jpg'
];

const question = `Describe this mobile screenshot in detail:
1. What website/app is shown (URL, name)?
2. What is the main content visible?
3. Are there any error messages or issues visible?
4. What language is the content in?
5. Any UI elements, buttons, or interactive components visible?`;

async function main() {
  for (let i = 0; i < images.length; i++) {
    console.log(`\n=== IMAGE ${i + 1}: ${images[i].split('/').pop()} ===\n`);
    const result = await analyzeImage(images[i], question);
    console.log(result);
  }
}

main();
