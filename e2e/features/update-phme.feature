@migrated-to-exui
Feature: The Update UCB

  Background:
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I choose "Upload response"
    And I upload a "PHME" doc contains further information "YES" for "PIP"
    Then the case should end in "Response received" state
    Then I should see PHME flag as "Under Review"

    When I switch to be a Judge
    And I choose "Review PHME request"

  @update-phme @bug-EUI-4125
  Scenario: Update UCB flag with upload response Granted and Refused
    And I set PHME Granted flag to "Yes"
    Then I should see PHME flag as "Granted"

    When I switch to be a Case Officer
    And I choose "Create a bundle"
    And I submit "Create a bundle"
    Then the bundles should be successfully listed in "History" tab
    And the case bundle details should be listed in "Bundles" tab
