@migrated-to-exui @nightly-test @update-other-party-subscriptions
Feature: The Update subscriptions

  Background:
    Given I presetup an "Child Support" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With FTA" state

    And I choose "Update other party data"
    And I add other party data
    Then the case should end in "Not listable" state
    And I choose "Update subscription"

  @preview-test-skip
  Scenario: Update Subscription - Yes
    And I subscribed to all parties including other party to "Yes"

  Scenario: Update Subscription - No
    And I subscribed to all parties including other party to "No"
