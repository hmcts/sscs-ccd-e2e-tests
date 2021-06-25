Feature: Common accessibility checks

@now @nightly-test
Scenario: Go to Sign in page
    Given I go to the sign in page
    Then the page is accessible
