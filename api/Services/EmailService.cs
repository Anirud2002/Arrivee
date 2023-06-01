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

        public async Task SendEmailAsync( string senderFirstName, string senderLastName, string senderFeedback, int Stars)
        {
            var formattedBody = @$"
                <p> Number of Stars: {Stars} <p>
                <br>
                <p> {senderFeedback}
            ";

            var email = _singleEmail
                .To("anirudstha5@gmail.com")
                .Subject($"ARRIVEE feedback - {senderFirstName} {senderLastName}")
                .Body(formattedBody, true);

            await email.SendAsync();

        }

        public async Task SendVerificationCodeAsync(int vertificationCode, string emailAddress)
        {
            var formattedBody = @$"
                <p> This is your vertification code to reset your password.<p>
                <br>
                <p> <b>{vertificationCode}</b>
                <br>
                <em><small> This code expires in 30 minutes </small><em>
            ";

            var email = _singleEmail
                .To(emailAddress)
                .Subject($"VERTIFICATION CODE - ARRIVEE")
                .Body(formattedBody, true);

            await email.SendAsync();
        }
    }
}

