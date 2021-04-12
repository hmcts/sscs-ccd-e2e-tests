@migrated-to-exui @reinstatement @nightly-test
Feature: The Reinstatement functionality

  Background:
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Action further evidence"
    And I fill the further evidence form with "Reinstatement request"
    Then the case should have successfully processed "Action further evidence" event

  @TA-599
  Scenario: Grant reinstatement
    When I switch to be a Judge
    When I choose "Issue directions notice"
    And I fill the direction notice form with "Grant reinstatement"
    Then the case should be "Granted" permissions for "Reinstatement"

  Scenario: Refuse reinstatement
    Given I am signed in as a Case Officer
    And navigate to an existing case
    When I choose "Action further evidence"
    And I fill the further evidence form with "Reinstatement request"
    Then the case should have successfully processed "Action further evidence" event

    When I switch to be a Judge
    When I choose "Issue directions notice"
    And I fill the direction notice form with "Refuse reinstatement"
    Then the case should be "Refused" permissions for "Reinstatement"

    
