const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv'); // Load the dotenv package

// Specify the path to your .env file
dotenv.config({ path: '/Users/jamesfrancis/Documents/GitHub/conf-statement-prototype/.env' });

const prototypeURL = 'https://conf-statement-enhancement-v1-c372e06a2a22.herokuapp.com/';
const htmlFilesFolder = '/Users/jamesfrancis/Documents/GitHub/conf-statement-prototype/app/views'; // Replace with the actual path

// Create a folder name with the domain name and today's date
const domainName = prototypeURL.split('/')[2];
const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in yyyy-mm-dd format
const outputFolderName = `${domainName}_${currentDate}`;

const outputFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', outputFolderName);

const passwordSelector = '#password';
const buttonSelector = '.govuk-button';

const navigationTimeout = 60000; // Increase the navigation timeout to 60 seconds (adjust as needed)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// Get the password from the environment variables
const password = process.env.SCREENSHOTPASSWORD;

// Check if the password is defined in the environment variables
if (!password) {
  console.error('Password not found in environment variables. Please set the PASSWORD variable in your .env file.');
  process.exit(1);
}


// Define a function to capture screenshots for a given URL
async function captureScreenshot(url, page) {
  try {
    // Navigate to the URL with an extended navigation timeout
    await page.goto(url, { timeout: navigationTimeout });

    // Dynamically adjust the viewport height to match the page's content height
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await page.setViewport({ width: 1920, height: Math.ceil(height) }); // Adjust width as needed

    // Capture a screenshot of the current page
    const pageName = url.split('/').pop(); // Use the page name as the screenshot filename
    await page.screenshot({ path: path.join(outputFolderPath, `${pageName}.png`) });

    console.log(`Screenshot captured for ${url}`);
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}: ${error}`);
  }
}

// Recursive function to capture screenshots from subdirectories
async function captureScreenshotsInDirectory(directory, page) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively capture screenshots in the subdirectory
      await captureScreenshotsInDirectory(filePath, page);
    } else {
      // If it's a file, check if it's an HTML file and capture a screenshot
      if (path.extname(file) === '.html') {
        const url = `${prototypeURL}${path.relative(htmlFilesFolder, filePath)}`; // Full URL
        await captureScreenshot(url, page);
      }
    }
  }
}

(async () => {
  try {
    // Create a unique output folder with a timestamp
    let folderNumber = 1;
    let uniqueFolderPath = outputFolderPath;

    while (fs.existsSync(uniqueFolderPath)) {
      uniqueFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', `${outputFolderName}_${folderNumber}`);
      folderNumber++;
    }

    fs.mkdirSync(uniqueFolderPath);

    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Set an extended timeout for navigation
    page.setDefaultNavigationTimeout(navigationTimeout);

    // Enter the password
    await page.goto(prototypeURL);
    await page.type(passwordSelector, process.env.SCREENSHOTPASSWORD);
    await page.click(buttonSelector);
    await delay(5000);

    // Start capturing screenshots in the main directory and its subdirectories
    await captureScreenshotsInDirectory(htmlFilesFolder, page);

    // Close the browser
    await browser.close();

    console.log('Screenshots captured successfully.');
    console.log('Output folder:', outputFolderPath);
  } catch (error) {
    console.error('Error:', error);
  }
})();