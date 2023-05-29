using System;
using System.Net;
using System.Net.Mail;
using api.Interfaces;
using FluentEmail.Core;
using FluentEmail.Razor;
using FluentEmail.Smtp;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IFluentEmail _singleEmail;
        public EmailService(IFluentEmail singleEmail)
        {
            _singleEmail = singleEmail;
        }

        public async Task SendEmailAsync( string senderFirstName, string senderLastName, string senderFeedback)
        {
            //var template =
            //    @"<p> @Model.Firstname @Model.Lastname gave this feedback: </p>
            //        <br>
            //        <p> @Model.Feedback </p>";

            var email = _singleEmail
                .To("anirudstha5@gmail.com")
                .Subject($"ARRIVEE feedback - {senderFirstName} {senderLastName}")
                .Body(senderFeedback);
            await email.SendAsync();

        }
    }
}

