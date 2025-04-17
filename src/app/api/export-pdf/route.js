// import puppeteer from "puppeteer";

// async function fetchImageAsBase64(imageUrl) {
//   const res = await fetch(imageUrl);
//   const arrayBuffer = await res.arrayBuffer();
//   const base64 = Buffer.from(arrayBuffer).toString("base64");
//   return `data:image/jpeg;base64,${base64}`;
// }

// async function generatePDF(users) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
  
//   // Add custom styles for the table and page
//   const styles = `
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         margin: 0;
//         padding: 0;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 20px;
//       }
//       th, td {
//         padding: 8px;
//         text-align: left;
//         border: 1px solid #ddd;
//       }
//       th {
//         background-color: #4CAF50;
//         color: white;
//       }
//       td {
//         background-color: #f9f9f9;
//       }
//       img {
//         width: 100px;
//         height: 100px;
//         object-fit: cover;
//         border-radius: 5px;
//         margin-right: 5px;
//       }
//       .page-break {
//         page-break-before: always;
//       }
//     </style>
//   `;
  
//   // Set the content with the custom styles
//   await page.setContent(`
//     <html>
//       <head>${styles}</head>
//       <body><div id="content"></div></body>
//     </html>
//   `);

//   const contentElement = await page.$("#content");

//   // Batch processing: Process users in chunks (e.g., 50 at a time)
//   const batchSize = 50;
//   const batches = Math.ceil(users.length / batchSize);

//   for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
//     const batchUsers = users.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
    
//     // Build the HTML for this batch
//     let batchHtml = "<table><tr><th>Name</th><th>Email</th><th>Photos</th></tr>";
    
//     for (let user of batchUsers) {
//       batchHtml += "<tr><td>" + user.name + "</td><td>" + user.email + "</td><td>";

//       const photos = user.photoUrls.slice(0, 2);  // Limit to 2 images per user
//       for (let photoUrl of photos) {
//         const base64Image = await fetchImageAsBase64(photoUrl);
//         batchHtml += `<img src="${base64Image}" />`;
//       }

//       batchHtml += "</td></tr>";
//     }

//     batchHtml += "</table>";

//     // Add this batch to the page content
//     await page.evaluate((batchHtml) => {
//       document.getElementById("content").innerHTML += batchHtml;
//     }, batchHtml);

//     // Add page break after each batch
//     await page.evaluate(() => {
//       const content = document.getElementById("content");
//       content.innerHTML += "<div class='page-break'></div>";
//     });
//   }

//   // Generate the PDF
//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: { top: 30, bottom: 30, left: 20, right: 20 },
//   });

//   await browser.close();
//   return pdfBuffer;
// }

// export async function POST(req) {
//   const { users } = await req.json();
//   const pdfBuffer = await generatePDF(users);

//   return new Response(pdfBuffer, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=interested-users.pdf",
//     },
//   });
// }
import puppeteer from "puppeteer";

async function generatePDF(users) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
        font-size: 12px;
      }
      th, td {
        padding: 8px;
        text-align: left;
        border: 1px solid #ddd;
        vertical-align: top;
      }
      th {
        background-color: #4CAF50;
        color: white;
      }
      td {
        background-color: #f9f9f9;
      }
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 5px;
      }
      .video-link {
        display: block;
        color: #1a0dab;
        text-decoration: underline;
        margin-bottom: 4px;
      }
      .page-break {
        page-break-before: always;
      }
    </style>
  `;

  await page.setContent(`
    <html>
      <head>${styles}</head>
      <body><div id="content"></div></body>
    </html>
  `);

  const contentElement = await page.$("#content");

  const batchSize = 50;
  const batches = Math.ceil(users.length / batchSize);

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    const batchUsers = users.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);

    let batchHtml = `
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Height</th>
          <th>Weight</th>
          <th>Location</th>
          <th>Photos</th>
          <th>Videos</th>
        </tr>
    `;

    for (let user of batchUsers) {
      batchHtml += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age || "-"}</td>
          <td>${user.height || "-"}</td>
          <td>${user.weight || "-"}</td>
          <td>${user.location || "-"}</td>
          <td>
      `;

      const photos = user.photoUrls?.slice(0, 2) || [];
      for (let photoUrl of photos) {
        batchHtml += `<img src="${photoUrl}" alt="photo" />`; // Using CDN URL directly
      }

      batchHtml += `</td><td>`;

      const videoLinks = user.videoUrls || [];
      for (let videoUrl of videoLinks) {
        batchHtml += `<a href="${videoUrl}" class="video-link">${videoUrl}</a>`;
      }

      batchHtml += `</td></tr>`;
    }

    batchHtml += `</table>`;

    // Insert the batch HTML into the page
    await page.evaluate((html) => {
      document.getElementById("content").insertAdjacentHTML('beforeend', html);
    }, batchHtml);

    // Add page break after each batch
    await page.evaluate(() => {
      document.getElementById("content").innerHTML += "<div class='page-break'></div>";
    });
  }

  // Ensure all images are loaded before generating PDF
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = resolve;
        });
      })
    );
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 30, bottom: 30, left: 20, right: 20 },
  });

  await browser.close();
  return pdfBuffer;
}

export async function POST(req) {
  const { users } = await req.json();
  const pdfBuffer = await generatePDF(users);

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=interested-users.pdf",
    },
  });
}