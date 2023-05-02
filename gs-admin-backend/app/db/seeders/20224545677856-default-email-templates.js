module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "email_templates", schema: "public" },
      [
        {
          is_default: true,

          admin_id: 0,
          type: 0,
          label: "Default Active User",
          dynamic_data: JSON.stringify([
            "siteName",
            "subject",
            "siteUrl",
            "siteLogo",
          ]),
          template_code: JSON.stringify({
            EN: `
                <!doctype html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <title>
            </title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
              #outlook a{padding: 0;}
                    .ReadMsgBody{width: 100%;}
                    .ExternalClass{width: 100%;}
                    .ExternalClass *{line-height: 100%;}
                    body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
                    table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
                    img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
                    p{display: block; margin: 13px 0;}
            </style>
            <!--[if !mso]><!-->
            <style type="text/css">
              @media only screen and (max-width:480px) {
                          @-ms-viewport {width: 320px;}
                          @viewport {	width: 320px; }
                      }
            </style>
            <!--<![endif]-->
            <!--[if mso]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if lte mso 11]>
            <style type="text/css">
              .outlook-group-fix{width:100% !important;}
            </style>
            <![endif]-->
            <style type="text/css">
              @media only screen and (max-width:480px) {

                      table.full-width-mobile { width: 100% !important; }
                      td.full-width-mobile { width: auto !important; }

              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                width: 100.000000% !important;
                max-width: 100.000000%;
              }
              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                width: 100.000000% !important;
                max-width: 100.000000%;
              }
              }
            </style>
          </head>
          <body>
            <div>
              <div style='background:#180832;margin:0px auto;padding:10px 0px;max-width:600px;'>
                <p class="text-center" style="color: #fff; text-align : center;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif; font-weight: bold">{{{siteName}}}</p>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#F9F5FF;;width:75%;border-radius: 20px'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px; text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word; background:#E0F0FF ;'>
                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:collapse;border-spacing:0px;'>
                                  <tbody>
                                    <tr>
                                      <td style='width:216px; '>
                                        <img alt='Descriptive Alt Text'   src={{{siteLogo}}}  style='border:none;display:block;font-size:13px; outline:none;text-decoration:none;width:100%;' width='216' />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding-top: 30px;word-break:break-word; '>
                                <div style="color:#FFFFFF;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:22px;font-weight: bold;color:#000;line-height:1;text-align:center;">
                                  Congratulation, Account Is Active Now
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:11px;padding:10px 20px;word-break:break-word;'>
                                <div style="color:#000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:20px;text-align:center;">
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;'>
                                  <tr>
                                    <td align='center' bgcolor='#178F8F' role='presentation' style='background-color:#6900CD;border:none;border-radius:4px;cursor:auto;padding:10px 25px;' valign='middle'>
                                      <a href={{{siteUrl}}} style="background:#6900CD;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
                                        Get Started
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                          </table>
                          <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#180832; width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px ;padding-bottom:0px;text-align:center;vertical-align:top;'>

                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <table border='0' cellpadding='0' cellspacing='0' style='cellpadding:0;cellspacing:0;color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:35%;' width='25%'>
                                  <tbody>
                                    <tr align='center'>
                                      <td align='center'>
                                        <a href='https://linkedin.com'>
                                          <img alt='linkedin' height='20px'src="https://i.ibb.co/1G0Kwf5/4.png"  width='20px'>
                                        </a>
                                      </td>
                                      <td align='center'>
                                        <a href='https://facebook.com'>
                                          <img alt='facebook' height='20px' src="https://i.ibb.co/Kb70H8Z/3.png" width='20px'>
                                        </a>
                                      </td>
                                      <td align='center'>
                                        <a href='https://twitter.com'>
                                          <img alt='twitter' height='20px'  src="https://i.ibb.co/qmPBb2z/2.png" width='20px'>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tbody>
                            <tr>
                              <td align='center' style='font-size:0px; ;word-break:break-word;'>
                                <div style="color:#fff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:20px;text-align:center; background: #180832">
                              @2022 {{{siteName}}}
                                </div>
                              </td>
                            </tr>
                            <tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 1,
          label: "Default In-Active User",
          dynamic_data: JSON.stringify([
            "siteName",
            "subject",
            "siteUrl",
            "siteLogo",
            "reason",
          ]),
          template_code: JSON.stringify({
            EN: `
                <!doctype html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <title>
            </title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
              #outlook a{padding: 0;}
                    .ReadMsgBody{width: 100%;}
                    .ExternalClass{width: 100%;}
                    .ExternalClass *{line-height: 100%;}
                    body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
                    table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
                    img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
                    p{display: block; margin: 13px 0;}
            </style>
            <!--[if !mso]><!-->
            <style type="text/css">
              @media only screen and (max-width:480px) {
                          @-ms-viewport {width: 320px;}
                          @viewport {	width: 320px; }
                      }
            </style>
            <!--<![endif]-->
            <!--[if mso]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if lte mso 11]>
            <style type="text/css">
              .outlook-group-fix{width:100% !important;}
            </style>
            <![endif]-->
            <style type="text/css">
              @media only screen and (max-width:480px) {

                      table.full-width-mobile { width: 100% !important; }
                      td.full-width-mobile { width: auto !important; }

              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                width: 100.000000% !important;
                max-width: 100.000000%;
              }
              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                width: 100.000000% !important;
                max-width: 100.000000%;
              }
              }
            </style>
          </head>
          <body>
            <div>
              <div style='background:#180832;margin:0px auto;padding:10px 0px;max-width:600px;'>
                <p class="text-center" style="color: #fff; text-align : center;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif; font-weight: bold">{{{siteName}}}</p>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#F9F5FF;;width:75%;border-radius: 20px'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px; text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word; background:#E0F0FF ;'>
                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:collapse;border-spacing:0px;'>
                                  <tbody>
                                    <tr>
                                      <td style='width:216px; '>
                                        <img alt='Descriptive Alt Text'   src={{{siteUrl}}}  style='border:none;display:block;font-size:13px; outline:none;text-decoration:none;width:100%;' width='216' />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding-top: 30px;word-break:break-word; '>
                                <div style="color:#FFFFFF;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:22px;font-weight: bold;color:#000;line-height:1;text-align:center;">
                                  Your Account is deactivated
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:11px;padding:10px 20px;word-break:break-word;'>
                                <div style="color:#000;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:20px;text-align:center;">
                                Reason For Deactivation <br><br>
                                {{{reason}}}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;'>
                                  <tr>
                                    <td align='center' bgcolor='#178F8F' role='presentation' style='background-color:#6900CD;border:none;border-radius:4px;cursor:auto;padding:10px 25px;' valign='middle'>
                                      <a href={{{siteUrl}}} style="background:#6900CD;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
                                        Visit Site
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                          </table>
                          <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#180832; width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px ;padding-bottom:0px;text-align:center;vertical-align:top;'>

                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <table border='0' cellpadding='0' cellspacing='0' style='cellpadding:0;cellspacing:0;color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:35%;' width='25%'>
                                  <tbody>
                                    <tr align='center'>
                                      <td align='center'>
                                        <a href='https://linkedin.com'>
                                          <img alt='linkedin' height='20px'src="https://i.ibb.co/1G0Kwf5/4.png"  width='20px'>
                                        </a>
                                      </td>
                                      <td align='center'>
                                        <a href='https://facebook.com'>
                                          <img alt='facebook' height='20px' src="https://i.ibb.co/Kb70H8Z/3.png" width='20px'>
                                        </a>
                                      </td>
                                      <td align='center'>
                                        <a href='https://twitter.com'>
                                          <img alt='twitter' height='20px'  src="https://i.ibb.co/qmPBb2z/2.png" width='20px'>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tbody>
                            <tr>
                              <td align='center' style='font-size:0px; ;word-break:break-word;'>
                                <div style="color:#fff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:12px;line-height:20px;text-align:center; background: #180832">
                              @2022 {{{siteName}}}
                                </div>
                              </td>
                            </tr>
                            <tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 2,
          label: "Default Email Verification",
          dynamic_data: JSON.stringify([
            "link",
            "subject",
            "userName",
            "playerEmail",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>Registration Email Verification</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style="font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;"> We just need to verify your email address to complete your Gammastack Gaming Signup.</p>
                                </div>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Email Address - <span style="color: #57D08A; font-weight: bold;">{{{playerEmail}}}</span></p>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Username - <span style="color: #57D08A; font-weight: bold;">{{{userName}}}</span></p>

                                <div style="padding-top: 16px;">
                                    <a href="{{{link}}}" style="background: linear-gradient(135deg, #b7b7b7, #1699f1);border-radius: 8px; color: #ffffff; font-size: 15px; text-align: center; text-decoration: none; display: block; padding: 10px 20px;">Verify Email</a>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 3,
          label: "Default Reset Password",
          dynamic_data: JSON.stringify(["link", "subject"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Reset Password</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>
                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">You have requested to reset <br>your password</h1>
                                <div style="display: flex; margin-bottom: 16px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">That's Okay, It happens! Click on the button below to reset your password.</p>
                                </div>
                                <div style="padding-top: 16px;">
                                    <a href="{{{link}}}" style="background: linear-gradient(135deg, #b7b7b7, #1699f1);border-radius: 8px; color: #ffffff; font-size: 15px; text-align: center; text-decoration: none; display: block; padding: 10px 20px;">Reset Password</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 4,
          label: "Default KYC Rejected",
          dynamic_data: JSON.stringify(["kycLabels", "subject", "reason"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>KYC Not Approved</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style="  font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">KYC Not Approved</h1>

                                <div style="display: flex;">
                                  <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Your document '{{{kycLabels}}}' was not approved.</p>
                                  <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Reason - {{{reason}}}</p>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 5,
          label: "Default KYC Verified",
          dynamic_data: JSON.stringify(["subject"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>KYC Verified - Pending KYC Labels</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">KYC Verified</h1>

                                <div style="display: flex;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Congratulations, Your Kyc Verification process is completed.</p>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,
          admin_id: 0,
          type: 6,
          label: "Default KYC Requested",
          dynamic_data: JSON.stringify(["subject", "kycLabels"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>KYC Request - Pending KYC Labels</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                  <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style="font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #2c2b69; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">KYC Request</h1>

                                <div style="display: flex;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Document '{{{kycLabels}}}' requested for KYC Verification</p>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #605f9c; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 8,
          label: "Default KYC Received",
          dynamic_data: JSON.stringify(["subject"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>KYC Received - Pending KYC Labels</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>
                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">KYC Received</h1>
                                <div style="display: flex;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">All Documents received for KYC Verification. Now verification process is started.</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 9,
          label: "Default KYC Approved",
          dynamic_data: JSON.stringify(["kycLabels", "subject"]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>KYC Approved</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>
                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">KYC Approved</h1>

                                <div style="display: flex;">
                                  <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Your Document {{{kycLabels}}} has been Approved.</p>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 10,
          label: "Default Withdraw Request Received",
          dynamic_data: JSON.stringify([
            "subject",
            "withdrawAmount",
            "playerCurrencySymbol",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>Pending Withdrawal Request Received</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Your withdraw request is created successfully and waiting for Approval.</p>
                                </div>
                                <p style="color: #ffffff; font-size: 12px; font-weight: 300; text-align: right;">Pending Withdrawal Amount</p>
                                <h1 style="color: #57D08A; font-size: 36px; text-align: right;">{{{playerCurrencySymbol}}} {{{withdrawAmount}}}</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 11,
          label: "Default Withdraw Approved",
          dynamic_data: JSON.stringify([
            "subject",
            "withdrawAmount",
            "playerCurrencySymbol",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Withdrawal Approved</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>
                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Your withdraw request is Approved, Withdraw amount will be transferred to your bank account shortly.</p>
                                </div>
                                <p style="color: #ffffff; font-size: 12px; font-weight: 300; text-align: right;">Approved Withdrawal Amount</p>
                                <h1 style="color: #57D08A; font-size: 36px; text-align: right;">{{{playerCurrencySymbol}}} {{{withdrawAmount}}}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 12,
          label: "Default Withdraw Processed",
          dynamic_data: JSON.stringify([
            "subject",
            "withdrawAmount",
            "playerCurrencySymbol",
            "transactionId",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>Withdrawal Processes</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Withdraw amount has been credited to your bank account.</p>
                                </div>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Transaction ID - <span style="color: #57D08A; font-weight: bold;">{{{transactionId}}}</span></p>

                                <p style="color: #ffffff; font-size: 12px; font-weight: 300; text-align: right;">Processed Withdrawal Amount</p>
                                <h1 style="color: #57D08A; font-size: 36px; text-align: right;">{{{playerCurrencySymbol}}} {{{withdrawAmount}}}</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 13,
          label: "Default Deposit Success",
          dynamic_data: JSON.stringify([
            "transactionId",
            "subject",
            "playerCurrencySymbol",
            "depositAmount",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>Deposit Success</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Amount is successfully deposited to your wallet, Keep Playing</p>
                                </div>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Transaction ID - <span style="color: #57D08A; font-weight: bold;">{{{ transactionId }}}</span></p>

                                <p style="color: #ffffff; font-size: 12px; font-weight: 300; text-align: right;">Deposit Amount</p>
                                <h1 style="color: #57D08A; font-size: 36px; text-align: right;">{{{playerCurrencySymbol}}} {{{depositAmount}}}</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 14,
          label: "Default Deposit Failed",
          dynamic_data: JSON.stringify([
            "transactionId",
            "subject",
            "playerCurrencySymbol",
            "depositAmount",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Deposit Failed</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">
            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1; ">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style=" font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>
                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <div style="display: flex; margin-bottom: 32px;">
                                    <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-left: 10px;">Your Deposit Failed</p>
                                </div>
                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Transaction ID - <span style="color: #57D08A; font-weight: bold;">{{{transactionId}}}</span></p>
                                <p style="color: #ffffff; font-size: 12px; font-weight: 300; text-align: right;">Deposit Amount</p>
                                <h1 style="color: #57D08A; font-size: 36px; text-align: right;">{{{playerCurrencySymbol}}} {{{depositAmount}}}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
        {
          is_default: true,

          admin_id: 0,
          type: 15,
          label: "Default Registration Welcome",
          dynamic_data: JSON.stringify([
            "playerFullName",
            "subject",
            "siteLoginUrl",
            "userName",
          ]),
          template_code: JSON.stringify({
            EN: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <title>Registration Email Welcome</title>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500&family=Roboto:wght@100;300;400;500;700;900&family=Style+Script&display=swap">

            <style>
                * {
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                }
            </style>
        </head>

        <body>
            <div style="width: 600px; background-color: #f7f9fa; font-family: 'Roboto', sans-serif; color: #ffffff; line-height: 1.4; margin: 15px auto;">
                <table border="0" style="width: 600px; background-color: #0e4c5e; border-width: 10px; border-style: solid; border-image-slice: 1;">
                    <tbody>
                        <tr>
                            <td style="padding: 16px;">
                                <h1 style="font-size: 30px; text-align: center;">Gammastack Gaming</h1>
                            </td>
                        </tr>

                        <tr>
                           <td style="background-color: #176f8a; padding: 24px;">
                                <h1 style="color: #57D08A; font-size: 30px; text-align: center; margin-bottom: 32px;">Welcome</h1>

                                <h6 style="color: #ffffff; font-size: 16px; margin-bottom: 16px;">Hello {{{playerFullName}}},</h6>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Money won is twice as sweet as money earned. Start your Gambling journey with us and win exciting rewards.</p>

                                <p style="color: #ffffff; font-size: 16px; font-weight: 300; margin-bottom: 16px;">Username - <span style="color: #57D08A; font-weight: bold;">{{{userName}}}</span></p>

                                <div style="padding-top: 16px;">
                                    <a href="{{{siteLoginUrl}}}" style="background: linear-gradient(135deg, #b7b7b7, #1699f1);border-radius: 8px; color: #ffffff; font-size: 15px; text-align: center; text-decoration: none; display: block; padding: 10px 20px;">Login to Your Account</a>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 16px;">
                                <p style="color: #ffffff; font-size: 12px; text-align: center;">© Copyright 2022</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>
        `,
          }),
          is_primary: 0,
          updated_at: new Date(),
          created_at: new Date(),
        },
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: "email_templates ", schema: "public" },
      null,
      {}
    );
  },
};
