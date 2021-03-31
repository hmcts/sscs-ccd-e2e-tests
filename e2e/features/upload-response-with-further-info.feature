@migrated-to-exui
Feature: The alternate happy path

  @alt-happy-path @nightly-test @bug-ticket-EUI-3535
  Scenario: Should end up in "With DWP" state when ALL fields are present
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information YES for "PIP"
    Then the case should be in "Response received" state

    When I switch to be a Case Officer
    When I choose "Response reviewed"
    And The page is accessible
    And I choose Requires Interlocutory Review No "Response reviewed"
    And The page is accessible
    And I submit "Response reviewed"
    Then the case should be in "Ready to list" state

  
  @happy-path @dwp-upload-response @uc @bug-ticket-EUI-3623
  Scenario: Should end up in "Ready to List" state when a UC disputed case has been response reviewed
    Given I presetup an "UC" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I choose "Upload response"
    And I upload UC further information with disputed General disputed by others Yes and further info Yes
    Then the case should be in "Response received" state

    When I switch to be a Case Officer
    And I choose "Response reviewed"
    When I review the UC received Response
    Then the case should be in "Ready to list" state