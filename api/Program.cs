using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Runtime;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// adding DynamoDB
var awsCreds = new BasicAWSCredentials(configuration["LocationReminderDB:AccessKey"], configuration["LocationReminderDB:SecretAccessKey"]);
var config = new AmazonDynamoDBConfig() {
    RegionEndpoint = Amazon.RegionEndpoint.USWest2
};
var dbClient = new AmazonDynamoDBClient(awsCreds, config);
builder.Services.AddSingleton<IAmazonDynamoDB>(dbClient);
builder.Services.AddSingleton<IDynamoDBContext, DynamoDBContext>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
