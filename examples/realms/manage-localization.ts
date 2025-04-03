/**
 * Example: Manage Realm Localization
 * 
 * This example demonstrates how to manage localization settings
 * for a Keycloak realm using the Admin SDK.
 */

import KeycloakAdminSDK from "../../src";
import { config } from "../config";

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    console.log(`Getting supported locales for realm: ${config.realm}`);
    
    // Get supported locales
    const locales = await sdk.realms.getLocalizationLocales(config.realm);
    console.log('Supported locales:');
    console.log(locales);
    
    // Define a locale to work with
    const locale = 'en';
    
    // Get localization texts for the locale
    console.log(`Getting localization texts for locale: ${locale}`);
    try {
      const texts = await sdk.realms.getLocalizationTexts(config.realm, locale);
      console.log('Localization texts:');
      console.log(JSON.stringify(texts, null, 2));
    } catch (error) {
      console.log(`No existing localization texts found for locale: ${locale}`);
    }
    
    // Add or update localization texts
    console.log(`Adding/updating localization texts for locale: ${locale}`);
    const newTexts = {
      'welcome': 'Welcome to our custom Keycloak instance',
      'loginTitle': 'Sign in to your account',
      'loginTitleHtml': '<div>Sign in to your account</div>',
      'customMessage': 'This text was added via the Admin SDK'
    };
    
    await sdk.realms.addLocalizationTexts(config.realm, locale, newTexts);
    console.log('Localization texts added/updated successfully');
    
    // Get specific localization text
    console.log(`Getting specific localization text for key: 'customMessage'`);
    try {
      const text = await sdk.realms.getLocalizationText(config.realm, locale, 'customMessage');
      console.log(`Text for 'customMessage': ${text}`);
    } catch (error) {
      console.log(`Failed to get text for 'customMessage': ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Update specific localization text
    console.log(`Updating specific localization text for key: 'customMessage'`);
    await sdk.realms.updateLocalizationText(
      config.realm, 
      locale, 
      'customMessage', 
      'This text was updated via the Admin SDK'
    );
    console.log('Localization text updated successfully');
    
    // Get updated localization text
    console.log(`Getting updated localization text for key: 'customMessage'`);
    try {
      const updatedText = await sdk.realms.getLocalizationText(config.realm, locale, 'customMessage');
      console.log(`Updated text for 'customMessage': ${updatedText}`);
    } catch (error) {
      console.log(`Failed to get updated text for 'customMessage': ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Delete specific localization text
    console.log(`Deleting specific localization text for key: 'customMessage'`);
    await sdk.realms.deleteLocalizationText(config.realm, locale, 'customMessage');
    console.log('Localization text deleted successfully');
    
    // Get updated localization texts to verify changes
    console.log(`Getting updated localization texts for locale: ${locale}`);
    try {
      const updatedTexts = await sdk.realms.getLocalizationTexts(config.realm, locale);
      console.log('Updated localization texts:');
      console.log(JSON.stringify(updatedTexts, null, 2));
    } catch (error) {
      console.log(`No localization texts found for locale: ${locale} after updates`);
    }
    
    // Note: Uncomment the following to delete all localization texts for the locale
    // console.log(`Deleting all localization texts for locale: ${locale}`);
    // await sdk.realms.deleteLocalizationTexts(config.realm, locale);
    // console.log('All localization texts deleted successfully');
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
