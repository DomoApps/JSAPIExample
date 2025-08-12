# App Translations

You can use this folder to add translation files for each language and/or locale
supported by DOMO.

To add a new language, just add the corresponding .json file in this folder.

## How does it work?

The app platform supports custom `index.html` files for each customer and/or locale
combination (see [here](https://git.empdev.domo.com/Development/domoapps/wiki/Dynamic-App-Loading) for reference).
When the platform detects an index file for a specific locale, it will load the
app using that file. This is then used to find and load the matching file with
translations and place it in `window.DATranslations` so it becomes available for
the entire app, independent from Redux and the App itself.



# Adding translation files

## A) Add all locales for a language
To do this, add the language file as `[language shorthand].json`.

For example, by adding the `es.json` only, you will automatically add the same
file for all supported `es` locales (see full list in the Supported Locales
section).

## B) Add translation file for specific locale
To do this, add the specific `.json` file for the locale you're targetting.

For instance, add `es-419.json` for Latinamerican Spanish translations.

The generator's build script will create an HTML index file for this specific
locale.

## *C) A combination of both
You can also add both `es.json` and `es-419.json`. In this case, the base
`es.json` file will be used for all other `es`-based locales, except for
`es-419`.

# */public/translations* folder
Only `.json` files are used from this folder. Any other file will be dropped
during the generator's postbuild process.

# Supported Locales

This is DOMO's supported list of locales and languages (list updated on Jan. 2023):

```
de
  de-AT
  de-DE
  de-CH

en
  en-AU,
  en-CA,
  en-150,
  en-HK,
  en-IE,
  en-IL,
  en-MO,
  en-NZ,
  en-SG,
  en-GB,
  en-US,
  en-001

es
  es-ES
  es-419
  es-MX
  es-US

fr
  fr-BE
  fr-CA
  fr-FR
  fr-CH

nl
  nl-BE
  nl-NL

pt
  pt-BR
  pt-PT

ja
  ja-JP

zh
  zh-CN
  zh-Hans-HK
  zh-Hans-MO
  zh-Hans-SG
```