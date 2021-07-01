@urgent-hearing @nightly-test
Feature: Urgent hearing functionality

  Scenario: Grant urgent hearing for a case 
    Given I am signed in as a Case Officer
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Action further evidence"
    And I fill the further evidence form with "Other document type" and "Urgent hearing request"
    Then the case should have successfully processed "Action further evidence" event

    When I switch to be a Judge
    When I choose "Issue directions notice"
    And I fill the direction notice form with "Grant urgent hearing"
    Then the case should be "Granted" permissions for "Urgent hearing"

  Scenario: Refuse urgent hearing for a case
    Given I am signed in as a Case Officer
    And navigate to an existing case
    When I choose "Action further evidence"
    And I fill the further evidence form with "Other document type" and "Urgent hearing request"
    Then the case should have successfully processed "Action further evidence" event

    When I switch to be a Judge
    When I choose "Issue directions notice"
    And I fill the direction notice form with "Refuse urgent hearing"
    Then the case should be "Refused" permissions for "Urgent hearing"