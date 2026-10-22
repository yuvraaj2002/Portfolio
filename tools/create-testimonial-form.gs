/**
 * Creates the partner testimonial Google Form and a linked response Sheet.
 * Run once from https://script.google.com (New project → paste → Run createTestimonialForm).
 * The form and sheet are created in your own Google Drive.
 */
function createTestimonialForm() {
  const form = FormApp.create('Share your experience working with Yuvraj')
    .setDescription('Takes about 2 minutes. Your feedback may appear on my portfolio website, and you choose how your name is shown. Thank you!')
    .setCollectEmail(true)
    .setProgressBar(false)
    .setConfirmationMessage('Thank you! I will send you the final wording before anything goes live.');

  form.addTextItem()
    .setTitle('Full name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Designation / role')
    .setHelpText('For example: Head of Operations, Founder, Product Manager')
    .setRequired(true);

  const project = form.addMultipleChoiceItem().setTitle('Which project did we work on together?').setRequired(true);
  project.setChoices([
    project.createChoice('Voice AI calling & SMS platform'),
    project.createChoice('Legal document workspace'),
    project.createChoice('Multilingual product advisor')
  ]).showOtherOption(true);

  form.addRatingItem()
    .setTitle('Overall rating')
    .setRatingScaleLevel(5)
    .setRatingIcon(FormApp.RatingIconType.STAR)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Your testimonial')
    .setHelpText('2–4 sentences. What problem did we solve, and what was it like working together?')
    .setValidation(FormApp.createParagraphTextValidation()
      .setHelpText('Please keep it under 400 characters so it fits on the card.')
      .requireTextLengthLessThanOrEqualTo(400)
      .build())
    .setRequired(true);

  form.addTextItem()
    .setTitle('One result you noticed (optional)')
    .setHelpText('For example: "follow-ups no longer missed", "cut review time in half", or a number you are comfortable sharing.');

  form.addPageBreakItem().setTitle('How you appear on the website');

  const display = form.addMultipleChoiceItem().setTitle('How should your name appear?').setRequired(true);
  display.setChoices([
    display.createChoice('Full name'),
    display.createChoice('First name and last initial'),
    display.createChoice('Role only (anonymous)')
  ]);

  form.addTextItem()
    .setTitle('Company / organisation (optional)');

  const showCompany = form.addMultipleChoiceItem().setTitle('Show your company name publicly?').setRequired(true);
  showCompany.setChoices([showCompany.createChoice('Yes'), showCompany.createChoice('No, keep it private')]);

  form.addTextItem()
    .setTitle('LinkedIn profile URL (optional)')
    .setHelpText('Used to verify the testimonial and, if you agree below, for your profile photo.')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please enter a full URL, starting with https://')
      .requireTextIsUrl()
      .build());

  const photo = form.addMultipleChoiceItem().setTitle('May I use your LinkedIn profile photo next to your testimonial?').setRequired(true);
  photo.setChoices([photo.createChoice('Yes'), photo.createChoice('No, show my initials instead')]);

  form.addCheckboxItem()
    .setTitle('Permission to publish')
    .setChoiceValues(['I agree that my testimonial, rating and the name/role details I chose above can be shown on Yuvraj Singh’s portfolio website.'])
    .setRequired(true);

  const sheet = SpreadsheetApp.create('Portfolio testimonials (responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Share this link with partners: ' + form.getPublishedUrl());
  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Responses sheet: ' + sheet.getUrl());
}
