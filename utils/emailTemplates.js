module.exports = {
  reset_link_template: (url) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Reset Password</title>
      
    </head>
    <body>
    
      <center>
        <table  border="0" width="80%" style="background-color: #E015A2">
    
        <tr width="100" style="padding: 20px ">
          <td colspan="1"></td>
          <td colspan="3" >
               <center> 
               <h3 style="color:white">OCTILEARN</h3>
               </center>    
          </td>
        </tr>
        <tr style="background-color: white;width: 100% "   >
          <td colspan="1"  rowspan="6" style="background-color: #E015A2" ></td>
        <td colspan="5" rowspan="6" style="padding-left: 10px" >
        <p style="color: #5f697a">
          It appears that you have forgotten your password.Use the link below to reset your password.
        </p>  	
      
          <a href="${url}" title="">
         ${url}
        </a>
        <p style="color: #5f697a">
          if you did not make this request , just ignore this email.
        </p>
  
          <center>
          <p>Best Regards,</p>
          <p>Octilearn  Team</p>
          <a href="#" title="" style="color:#E015A2;">octilearn.io</a>
        </center>
        </td>
          
            <td colspan=""  rowspan="6" headers="" style="background-color: #E015A2"></td>
    
           </tr>
               
        </table>
      </center>
    
    </body>
    </html>`;
  },
};
