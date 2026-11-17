import {ML_ACCOUNT, ML_FORM} from './config';

const endpointFor = (form) => `https://assets.mailerlite.com/jsonp/${ML_ACCOUNT}/forms/${form}/subscribe`;

/**
 * Sends the email to the MailerLite form "Quick Reference Sign up".
 * Double opt-in is off: the person joins the group straight away and the
 * welcome email (automation) is sent. The page shows the PDF button at once.
 * Field names are the ones in MailerLite's own HTML code for this form.
 * Throws an Error with a short message the reader can see.
 */
export async function subscribe(email, form = ML_FORM) {
  const body = new FormData();
  body.append('fields[email]', email);
  body.append('ml-submit', '1');
  body.append('anticsrf', 'true');

  let res;
  try {
    res = await fetch(endpointFor(form), {method: 'POST', body});
  } catch (e) {
    throw new Error('Could not reach the sign-up service. Please check your connection and try again.');
  }

  let text = '';
  try {
    text = await res.text();
  } catch (e) {
    /* fall through */
  }

  let data = null;
  try {
    data = JSON.parse(text);
  } catch (e) {
    /* not JSON */
  }

  if (data && data.success) return;
  if (!data && res.ok && /ml_webform_success/.test(text)) return;

  const fieldErrors = data && data.errors && data.errors.fields;
  const first = fieldErrors && Object.values(fieldErrors)[0];
  throw new Error(Array.isArray(first) && first[0] ? first[0] : 'Something went wrong. Please try again.');
}
