@migrated-to-exui @nightly-test @update-other-party-subscriptions @preview-test
Feature: The Update subscriptions

  Background:
    Given I presetup an "Child Support" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should end in "With DWP" state

    And I choose "Update other party data"
    And I add other party data
    Then the case should end in "Not listable" state

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Update subscription"

  Scenario: Update Subscription - Yes
    And I subscribed to all parties including other party to "Yes"

  Scenario: Update Subscription - No
    And I subscribed to all parties including other party to "No"
