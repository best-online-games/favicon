# Использование из .view\.tree

Минимально — ровно так:

```view.tree
$my_app $mol_page
	plugins /
		<= Favicon $bog_favicon
			Icon <= icon $mol_icon_waze
```

## Пример: переключение по теме/состоянию

```view.tree
$my_app $mol_page
	plugins /
		<= Theme $mol_theme_auto
		<= Favicon $bog_favicon
			Icon <= icon
```

```ts
namespace $.$$ {
	export class $my_app extends $.$my_app {
		@ $mol_mem
		icon() {
			return this.$.$mol_lights()
				? new this.$.$mol_icon_moon()
				: new this.$.$mol_icon_web()
		}
	}
}
```

## Что передавать в Icon?

Любой объект с методом `path(): string`. Все `$mol_icon_*` подходят.
