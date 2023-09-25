const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv'); // Load the dotenv package

// Specify the path to your .env file
dotenv.config({ path: '/Users/jamesfrancis/Documents/GitHub/conf-statement-prototype/.env' });

const prototypeURL = 'https://conf-statement-enhancement-v1-c372e06a2a22.herokuapp.com/';
const appViewsFolder = '/Users/jamesfrancis/Documents/GitHub/conf-statement-prototype/app/views'; // Updated path

const passwordSelector = '#password';
const buttonSelector = '.govuk-button';

const navigationTimeout = 60000; // Increase the navigation timeout to 60 seconds (adjust as needed)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get the password from the environment variables
const password = process.env.SCREENSHOTPASSWORD; // Updated environment variable

// Check if the password is defined in the environment variables
if (!password) {
  console.error('Password not found in environment variables. Please set the SCREENSHOTPASSWORD variable in your .env file.');
  process.exit(1);
}

// Extract the domain name from the prototype URL
const domainName = new URL(prototypeURL).hostname.replace(/\./g, '_');

// Create a unique output folder with a timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-'); // Generate a timestamp
let folderNumber = 1;
let outputFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', `${domainName}_${timestamp}`);

while (fs.existsSync(outputFolderPath)) {
  outputFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', `${domainName}_${timestamp}_${folderNumber}`);
  folderNumber++;
}

// Ensure the output folder exists
fs.mkdirSync(outputFolderPath, { recursive: true });

// Define a function to capture screenshots for a given URL
async function captureScreenshot(url, page, outputPath) {
  try {
    // Navigate to the URL with an extended navigation timeout
    await page.goto(url, { timeout: navigationTimeout });

    // Dynamically adjust the viewport height to match the page's content height
    const bodyHandle = await page.$('body');
    const { height } = await bodyHandle.boundingBox();
    await page.setViewport({ width: 1920, height: Math.ceil(height) }); // Adjust width as needed

    // Determine the relative path within app/views folder
    const relativePath = path.relative(appViewsFolder, outputPath);
    
    const screenshotPath = path.join(outputFolderPath, relativePath); // Save to the corresponding output folder structure

    // Create directories if they don't exist
    fs.mkdirSync(screenshotPath, { recursive: true });

    // Capture a screenshot of the current page
    const pageName = url.split('/').pop(); // Use the page name as the screenshot filename
    const screenshotFilename = `${pageName}.png`;
    const screenshotFilePath = path.join(screenshotPath, screenshotFilename);

    // Capture a screenshot without URL text overlay
    await page.screenshot({ path: screenshotFilePath });

    // Add the URL as a text overlay
    await page.evaluate((url) => {
      const div = document.createElement('div');
      div.textContent = url;
      div.style.position = 'fixed';
      div.style.bottom = '6px';
      div.style.left = '6px';
      div.style.backgroundColor = '#505a5f';
      div.style.padding = '5px 10px';
      div.style.color = 'white';
      div.style.fontFamily = 'Arial, Helvetica, sans-serif';
      div.style.fontSize = '18px';
      document.body.appendChild(div);
    }, url);

    // Capture the screenshot with the URL text overlay
    await page.screenshot({ path: screenshotFilePath });

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
        const url = `${prototypeURL}${path.relative(appViewsFolder, filePath)}`; // Full URL
        await captureScreenshot(url, page, filePath); // Pass the output path
      }
    }
  }
}

(async () => {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Set an extended timeout for navigation
    page.setDefaultNavigationTimeout(navigationTimeout);

    // Enter the password
    await page.goto(prototypeURL);
    await page.type(passwordSelector, password); // Use the password from environment variables
    await page.click(buttonSelector);
    await delay(5000);

    // Start capturing screenshots in the main directory and its subdirectories
    await captureScreenshotsInDirectory(appViewsFolder, page);

    // Close the browser
    await browser.close();

    console.log('Screenshots captured successfully.');
    console.log('Output folder:', outputFolderPath);
  } catch (error) {
    console.error('Error:', error);
  }
})();






