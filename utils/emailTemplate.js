exports.forgotMessage = (resetUrl, user) => {
    return `
              <body 
                style="
                  color: rgb(68, 68, 68);
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                "
              >
                <h2 style="color: black;">You requested to reset the password</h2>
                <p style="
                  color: black;
                  margin-bottom: 20px;
                ">
                  Tap the link below to reset your account password. If you didn't request a
                  new password, you can safely delete this email.
                </p>
                <a
                class="reset-btn"
                style="
                  color: white;
                  font-weight: 700;
                  text-decoration: none;
                  background-color: #FF5500;
                  padding: 11px 48px;
                  border-radius: 10px;
                "
                target="blank"
                href="${resetUrl}"
              >
                Reset Password
              </a>
          
                <p 
                  style="
                    color: black;
                    margin-top: 20px;
                  ">
                  If that doesn't work, copy and paste the following link in your browser:
                </p>
                <div class="text-link">
                  <a target="blank" href="${resetUrl}"> ${resetUrl} </a>
                </div>
                <p class="footer" style="font-size: small; font-style: italic">
                  <span>Thank you,</span> <br />
                  <span>Rentify Team</span>
                </p>
              </body>
          `;
  };
  