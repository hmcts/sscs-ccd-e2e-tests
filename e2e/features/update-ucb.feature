Feature: The Update UCB

@update-ucb @nightly-test @migrated-to-exui
  Scenario: Update UCB flag with upload response Granted and Refused
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I choose "Upload response"
    And I upload a "UCB" doc contains further information "YES" for "PIP"
    Then the case should be in "Response received" state
    Then I should see UCB flag
    And The page is accessible

    And I choose "Update UCB flag"
    And The page is accessible
    And I set UCB flag to "No"



