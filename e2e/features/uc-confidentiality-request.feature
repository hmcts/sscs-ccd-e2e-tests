Feature: UC Final Decision Notices

  @uc-confidentiality-request @nightly-test
  Scenario: confidentiality request for appellant
    Given I am signed in as a Case Officer
    And I have a UC bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

    When I choose "Update to case data"
    And I update joint party to "YES" for UC
    And I choose "Action further evidence"
    Then I update the scanned document for "Appellant"
    And I choose "Action further evidence"
    Then I update the scanned document for "JointParty"

  @nightly-test
  Scenario: Review Confidentiality - Granted for Appellant and Refused for Joint Party
    When I switch to be a Judge
    And navigate to an existing case
    And I choose "Review confidentiality request"
    And I select Granted for Appellant and Refused for Joint Party as a confidentiality
    Then the case should be in "With DWP" appeal status

