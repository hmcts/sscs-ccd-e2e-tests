Feature: The alternate happy path

  @alt-happy-path @nightly-test
  Scenario: Should end up in "With DWP" state when ALL fields are present
    Given I am signed in as a Case Officer
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Upload response"
    And I upload contains further information 'YES' for "PIP"
    Then the case should be in "Response received" appeal status

    When I switch to be a Case Officer
    When I choose "Response reviewed"
    And I choose Requires Interlocutory Review No "Response reviewed"
    And I submit "Response reviewed"
    Then the case should be in "Ready to list" appeal status
