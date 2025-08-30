namespace $.$$ {

	/** Минималистичный плагин для установки favicon. */
	export class $bog_favicon extends $.$mol_plugin {

		/** Текущая иконка. Можно переопределять/менять реактивно где угодно. */
		@ $mol_mem
		icon(next?: { path(): string }): { path(): string } {
			if (next !== undefined) return next as never
			// дефолт на всякий
			return new this.$.$mol_icon_bird()
		}

		/** SVG data URL для фавиконки. */
		@ $mol_mem
		favicon_data(): string {
			const path = this.icon()?.path?.() ?? ''
			const svg  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`
			return 'data:image/svg+xml,' + encodeURIComponent(svg)
		}

		/** Применяем <link rel="icon"> в <head>. */
		apply_favicon(): void {
			const doc = this.$.$mol_dom_context.document
			if (!doc) return

			const href = this.favicon_data()
			for (const rel of ['icon', 'shortcut icon', 'apple-touch-icon'] as const) {
				let link = doc.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
				if (!link) {
					link = doc.createElement('link')
					link.rel = rel
					doc.head.appendChild(link)
				}
				link.type = 'image/svg+xml'
				if (link.href !== href) link.href = href
			}
		}

		/** Привязка побочного эффекта к жизненному циклу. */
		override auto() {
			// завязываемся на icon() → favicon_data()
			this.favicon_data()
			this.apply_favicon()
			return null as any
		}

		/** DOM не нужен. */
		override sub() { return [] as const }
	}
}
