import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  function wait(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  try {
    const resend = new Resend('re_Cis7ThYA_B8vcY5FC6PZrJJu8tewVkSQH')
    const body = await readBody(event);
    const {from, to, subject, html} = body;

    await wait(500);
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
  } catch (e) {
    console.error('Email send failed', e)
    // optionally handle error
  }
  // Return something so Nitro knows the route is done
  return { success: true }
})
