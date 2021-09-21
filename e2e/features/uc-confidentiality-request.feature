Feature: UC Final Decision Notices

  @uc-confidentiality-request @nightly-test
  Scenario: confidentiality request for appellant
    Given I presetup an "UC" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    Given I choose "Upload response"
    And I upload UC further information with disputed General disputed by others No and further info No
    And I wait "8" seconds
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

