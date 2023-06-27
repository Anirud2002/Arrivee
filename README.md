
# Arrivee

A mobile-app that lets you set location based reminders. [Test Beta Version](https://testflight.apple.com/join/Jr8SZOcO)


## Who is this app for?

This app is for people who forget to do task(s) when they arrive or depart from some location. It will send notification to user's device when they enter or leave a certain location they have set.
## Tech Stack

**Client:** Angular, Ionic, Capacitor, TailwindCSS

**Server:** C#, Dotnet6, AWS Lambda (Serverless)

**Database:** DynamoDB


## How to run on your machine? (Locally)

Clone the repo

```bash
  git clone https://github.com/Anirud2002/Arrivee.git
```
Install client dependencies and run locally

```bash
    //open the project in your fav IDE

    cd /client
    npm install
    ionic serve
```

Install backend dependencies and run locally

```bash
    cd /api
    dotnet build
    dotnet run
```

Run Client and Backend simultaneously to make the app work how it's supposed to!

Please make sure to update api/appsettings.json to add your own api keys and SMTP host and password.
## Acknowledgements

 - Special thanks to **Ang Chhimi Sherpa** for helping on the UI/UX aspect of this app [(Her Portfolio)](https://www.chhimi.me/)



## Demo

<img src="https://github.com/Anirud2002/Arrivee/raw/main/demo.gif" alt="" style="width: 100%; display: inline-block;" data-target="animated-image.originalImage">

