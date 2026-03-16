import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function analyzeImages() {
  try {
    const zai = await ZAI.create();
    
    const imagePaths = [
      '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٠١٢٢_com_android_chrome_ChromeTabbedActivity.jpg',
      '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧١٧٣٧_com_android_chrome_ChromeTabbedActivity.jpg',
      '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٢٧٤٥_com_android_chrome_ChromeTabbedActivity.jpg',
      '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٤٤٢٣_com_android_chrome_ChromeTabbedActivity.jpg',
      '/home/z/my-project/upload/Screenshot_٢٠٢٦٠٣١٠_٠٧٥٢٣٨_com_android_chrome_ChromeTabbedActivity.jpg'
    ];

    const results: Array<{ image: number; analysis: string }> = [];

    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(`\n=== تحليل الصورة ${i + 1} ===`);
      
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const response = await zai.chat.completions.createVision({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'هذه لقطة شاشة لتطبيق ويب على هاتف محمول. صف بالتفصيل ما تراه: المحتوى، الألوان، الواجهة، أي أخطاء أو رسائل خطأ، حالة التطبيق. أجب بالعربية بالتفصيل.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      });

      const analysis = response.choices[0]?.message?.content || '';
      console.log(analysis);
      results.push({ image: i + 1, analysis });
    }

    // Save all results
    fs.writeFileSync('/home/z/my-project/download/screenshots_analysis.json', JSON.stringify(results, null, 2));
    console.log('\n✅ تم حفظ التحليل في /home/z/my-project/download/screenshots_analysis.json');
    
  } catch (error: any) {
    console.error('خطأ:', error.message);
  }
}

analyzeImages();
