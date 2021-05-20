@reasonable-adjustments @nightly-test
Feature: Reasonable adjustments functionality

  Scenario: Actioned reasonable adjustments
    Given I am signed in as a Case Officer
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I choose "Update reasonable adjustment"
    And generate a letter in "Alternative Letter Format"
    Then reasonable adjustment details are seen in summary page

    When I choose "Issue directions notice"
    And I fill the direction notice form with "Provide information"
    Then Reasonable adjustment tab is seen with "Reasonable adjustment status" as "Required"

    When I choose "Process reasonable adjustment"
    And I update adjustment status to be "Actioned"
    Then Reasonable adjustment tab is seen with "Reasonable adjustment status" as "Actioned"


  Scenario: Required reasonable adjustments
    Given I am signed in as a Case Officer
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I choose "Update reasonable adjustment"
    And generate a letter in "Alternative Letter Format"
    Then reasonable adjustment details are seen in summary page

    When I choose "Issue directions notice"
    And I fill the direction notice form with "Provide information"
    Then Reasonable adjustment tab is seen with "Reasonable adjustment status" as "Required"

    When I choose "Process reasonable adjustment"
    And I update adjustment status to be "Required"
    Then Reasonable adjustment tab is seen with "Reasonable adjustment status" as "Required"



    
