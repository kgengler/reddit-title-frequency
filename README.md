# Reddit Title Frequency

This application will take the most popular posts on a subreddit for the last
week and aggregate post titles by the individual words used in the title. The
front end client will take this information and display it as a word cloud. Most
of the work is done by an AWS lambda function that is accessed through an AWS
API Gateway. 

On subreddits like funny where there is a broad range of content, the results
aren't that interesting. However, if you go to a more focused subreddit like
rust, or even politics, you will see more interesting word frequencies.

## Lambda function 

Inside the lambda directory is the code for the lambda function that does most
of the heavy lifting. 

### Install dependencies

Inside the lamda directory run:

```
$ yarn install
```

### Run Tests

Inside the lambda directory run

```
$ yarn test
```

or

```
$ jasmine
```

### Create deployment artifact

To create the zip file to deploy to AWS lambda, run

```
$ yarn run build
```

this will result in a `deployment.zip` file that can be deployed to AWS

## Front end

For demonstration purposes, this also includes a basic front end client
availible through GitHub pages at
[https://kgengler.github.io/reddit-title-frequency/](https://kgengler.github.io/reddit-title-frequency/)


