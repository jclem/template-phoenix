// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

const plugin = require('tailwindcss/plugin')
const fs = require('fs')
const path = require('path')

module.exports = {
  content: ['./js/**/*.js', '../lib/*_web.ex', '../lib/*_web/**/*.*ex'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({addVariant}) =>
      addVariant('phx-no-feedback', ['.phx-no-feedback&', '.phx-no-feedback &'])
    ),
    plugin(({addVariant}) =>
      addVariant('phx-click-loading', [
        '.phx-click-loading&',
        '.phx-click-loading &'
      ])
    ),
    plugin(({addVariant}) =>
      addVariant('phx-submit-loading', [
        '.phx-submit-loading&',
        '.phx-submit-loading &'
      ])
    ),
    plugin(({addVariant}) =>
      addVariant('phx-change-loading', [
        '.phx-change-loading&',
        '.phx-change-loading &'
      ])
    ),

    // Embeds Hero Icons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({matchComponents, theme}) {
      const iconsDir = path.join(__dirname, '../priv/hero_icons/optimized')

      const icons = [
        ['', '/24/outline'],
        ['-solid', '/24/solid'],
        ['-mini', '/20/solid']
      ]

      /** @type Record<string, {name: string, fullPath: string}> */
      const values = icons.reduce((values, [suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).map(file => {
          const name = path.basename(file, '.svg') + suffix
          values[name] = {name, fullPath: path.join(iconsDir, dir, file)}
        })

        return values
      }, {})

      /** @type typeof matchComponents<{name: string, fullPath: string}> */
      matchComponents(
        {
          hero: value => {
            if (typeof value === 'string') {
              throw new Error('hero: expected an object, got a string')
            }

            const {name, fullPath} = value

            const content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, '')

            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              '-webkit-mask': `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              'background-color': 'currentColor',
              'vertical-align': 'middle',
              display: 'inline-block',
              width: theme('spacing.5'),
              height: theme('spacing.5')
            }
          }
        },
        {values}
      )
    })
  ]
}
