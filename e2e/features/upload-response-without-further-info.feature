@migrated-to-exui
Feature: The happy path

  @happy-path @nightly-test @dwp-upload-response
  Scenario: Should end up in "Ready to list" state when ALL fields are present
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should end in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    When I choose "Upload response"
    And I upload contains further information "NO" for "PIP"
    Given I navigate to an existing case
    Then the case should end in "Ready to list" state

    When I switch to be a Case Officer
    Then the case should end in "Ready to list" state


 @happy-path @nightly-test-wip @dwp-upload-response
  Scenario: Should end up in "Ready to List" state when a UC is not disputed by others
    Given I presetup an "UC" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I choose "Upload response"
    And I upload UC further information with disputed General disputed by others No and further info No
    Then the case should be in "Ready to list" state

    When I switch to be a Case Officer
    Then the case should be in "Ready to list" state