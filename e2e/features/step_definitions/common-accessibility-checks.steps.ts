import { AnyCcdPage } from '../../pages/any-ccd.page';
import { Given } from 'cucumber';
import { AuthenticationFlow } from '../../flows/authentication.flow';

const authenticationFlow = new AuthenticationFlow();

const anyCcdPage = new AnyCcdPage();

Given(/^I go to the sign in page$/, async function () {
    await authenticationFlow.goToSignInPage();
    await anyCcdPage.pageHeadingContains('Sign in')
});
