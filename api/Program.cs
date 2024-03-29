using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Runtime;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using api;
using api.Extensions;
using api.Interfaces;
using api.Services;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
BasicAWSCredentials awsCreds;

if (builder.Environment.IsDevelopment())
{
    awsCreds = new BasicAWSCredentials(configuration["LocationReminderDB:AccessKey"], configuration["LocationReminderDB:SecretAccessKey"]);
    // adding fluent email
    builder.Services
        .AddFluentEmail("arrivebot@gmail.com")
        .AddRazorRenderer(typeof(Program))
        .AddSmtpSender(configuration["SMTP:Host"], 587, "anirudstha5@gmail.com", configuration["SMTP:Password"]);
}
else
{
    var secrets = await (new Secrets().GetSecret());
    awsCreds = new BasicAWSCredentials(secrets.DBAccessKey, secrets.DBSecretAccessKey);
    // adding fluent email
    builder.Services
        .AddFluentEmail("arrivebot@gmail.com")
        .AddRazorRenderer(typeof(Program))
        .AddSmtpSender(secrets.SmtpHost, 587, "anirudstha5@gmail.com", secrets.SmtpPassword);
}

// adding DynamoDB
var config = new AmazonDynamoDBConfig()
{
    RegionEndpoint = Amazon.RegionEndpoint.USWest2
};
var dbClient = new AmazonDynamoDBClient(awsCreds, config);
builder.Services.AddSingleton<IAmazonDynamoDB>(dbClient);
builder.Services.AddSingleton<IDynamoDBContext, DynamoDBContext>();

// adding token service
builder.Services.AddScoped<ITokenService, TokenService>();
// adding email service
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddAuthorization();
builder.Services.AddAuthenticationServices(builder.Configuration);

// adding ApiGateway & Lambda
builder.Services.AddAWSLambdaHosting(LambdaEventSource.RestApi);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().WithOrigins("*"));

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
