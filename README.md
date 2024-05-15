# Vapi SDK Integration Examples

This repository provides comprehensive examples on how to integrate the Vapi SDK into your website. Whether you are looking for a simple integration or a more customized setup with extensions, you'll find the necessary resources here to get started.

## Prerequisites

Before you begin, ensure you have Node.js installed on your machine. You can download and install it from [Node.js official website](https://nodejs.org/).

## Getting Started

Clone the repository to your local machine:

```
git clone <repository-url>
cd <repository-directory>
```

## Examples Overview

There are three main examples included in this repository, each contained within its own HTML file:

### 1. Basic Integration

**File:** `index2.html`

This example demonstrates the simplest way to integrate the Vapi web snippet into your site. Just include the provided snippet in your HTML and you're ready to go. This is ideal for those who want a quick setup without any modifications.

### 2. Integration with Custom Extensions

**File:** `index3.html`

For those who need more than the basics, this example shows how to extend the functionality of the Vapi web snippet. It guides you through the process of adding custom extensions to enhance the integration according to your needs.

### 3. Advanced Integration Using Webpack and npm

**Files:**
- `index.html`
- `src/index.js`

This setup is for advanced users who are comfortable with Node.js environments. To integrate the Vapi SDK using Webpack and npm, follow these steps:

1. Install the necessary packages:

    ```
    npm install
    ```

2. Build your project:

    ```
    npm run build
    ```

3. Make sure to provide your public Vapi API key within the `/src/index.js` file on line 10.

This example will guide you through setting up the SDK in a more structured project using module bundlers and package managers.

## Support

For any issues or questions, please open an issue in the repository or contact support via our website.
