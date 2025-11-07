Feature: Home QA tool

  Scenario Outline: Access to QA tool and select card success
    Given I go to the home page
    When I select the "<cardName>"
    Then I should see the redirect page

  Examples:
    | cardName                |
    | Elements                |
    | Forms                   |
    | Alerts, Frame & Windows |
    | Widgets                 |
    | Interactions            |
    | Book Store Application  |
