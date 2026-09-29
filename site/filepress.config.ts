import { defineFilepressConfig } from 'getfilepress';

const github = 'https://github.com/Catalyst-Forge-LLC/forgetrail';

export default defineFilepressConfig({
	title: 'ForgeTrail',
	description:
		'A persistent development system for building software with AI agents. Forge the path. Keep the trail.',
	url: 'https://forgetrail.dev',
	author: 'Catalyst Forge LLC',
	tagline: 'Forge the path. Keep the trail.',
	lede: 'Phase · decisions · next session',
	homePage: 'home',
	logo: '/logo.png',
	ogImage: '/logo.png',
	nav: [
		{ label: 'Home', href: '/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Try', href: '/try' },
		{ label: 'GitHub', href: github, icon: 'github' }
	],
	footerLinks: [
		{ label: 'See the rest of the Catalyst Forge shelf.', href: 'https://catalystforge.com/tools/' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Try', href: '/try' },
		{ label: 'About', href: '/about' },
		{ label: 'GitHub', href: github, icon: 'github' },
		{ label: 'Catalyst Forge', href: 'https://catalystforge.com' },
		{ label: 'AppFacts', href: 'https://appfacts.dev/v#af1.eNp1UsFq3DAQ_RUxpwa067ZHn1oMOZQkBJJbKWVWGtvqypLQjJ26i_-9yHa3S6E3Id578-bNu8AE9QcNAQeCGu5j7ug1o_OgQeZU_jiRUZWSGL0LHWhgQRkZakAjbiLQ4J2hwAX8OaHp6fDx-H4DmjPUF_AYuhG7AviCE76Y7JJo9Ton2t6gIY9B3GriKVo6_uDiYJ9Zw2O05FUTg9BPUc85SjTRq3ePzfMdaOgjywZsfBxt6zETLBosJYb66wUC1PBpKCJm00i7RMX2DBrS_2cw5YmyckPyNFAQFBcDLHoT_RXtTn8xPQ2oJvTOrhiFwaoSonKhpUzB0JX2ljF0nvLO_etaWUo-zmXQGvmV0ZG0zlPKxLyz7p2nwwmZrFq3CqIGDNitNmH5poEnc13_JhkNGeo_oamU4-QsZdXGrN7oxE5oZZ9G5225X0Jzxo6-b-qFm0IayoGIBWoYg3VsfGQqYRj3z9dSDjRQ2hrQiySuq6otXZPStaOlqXiiFNlJzPMNqnPSj6ejiUPVoKCfWQ5rSw8PD82NBiy_ATHV9b4' },
		{ label: 'ToolFacts', href: 'https://toolfacts.dev/v#tf1.eNrFl01vGzcQhv_KgKekWCmOW_Rjb66bBEGc2HBc5BAEAU3O7jLictjhrFTV8H8vZndlq2qaSw-6CSuS8z6cT96ZtamfVybZHk1tXhK3eMM2RHh7fgXvkdfIpjIe1xgpI5vanFuxcVsExsWmMmvkEiiZ2pwsf1h-bypTxMpQTG2sk7DWNTE4TEVNnGXrOlycLk9MZVYheVOb3uVF2dniIUlQNXcG_0Q3yHR2JGfjIjM5LMVURtimkonF1KaID2TuK-MYPSYJNhbdz_jHEBi9qT9-uq8Mtqx76zsjGLFH4a2pTaKEI2KRkKxaK_N6IdJzPt7trmdtY_BW9IbcKqRWUYPHz9g06ESBGa1XBrSuU0NNiFi2RbBXmY4y6t8JZUO8ejQ-Y2ExdWNjwfvKBI99JsEkphYesDJ54EzjHZ5HW0potmBBz2kibT7LrGn5pVACtbuEM8gUkiBDKGCdwyzo9fOGg9jbiODJDT0mGReAo9TE4GRp7qsH6PxV0Fn410HnP_83JqWEGkFBtuA6dKsaGGXgVIBWFWTrVrZFmAOwgpeX169e3Fyfvb74fH15eVOBTR42HUqHDB8ur9-8vLj8sOw9bGyBhobk90FblKvOFnw1BG-Tw-NAX4-A0KN05ClSu4V2FgQNMViYk3F0W1bB8OT54qen-ygFLbvuAkvRaD4Kx_tRAkiHsFdV4igJvBV7q8pvt7DC7Yb40BM32Odo5bhOsPvSH1JFZmnQMPX6uTz7btn_A4CHdDb4IEdWX4QHJwOjB6tyIDP1WcY4Use4gXmMIqYv6ASeeMICiQSKs2lcokJKtg4hSMHYPD3w07mmZQzl2Kg7BLfTMydLr0aFEsLM3AwxPq46jLq5iL53Hfb2qEiqdYZaMDpiD4wNMiaHS7jpECK21m1hV_ihdDajFnIl70PLYzOrRn9aSLiZusIB8lmScGVFkI9VKWbgXX5psCYJizyLmtJMr2OvJh7Wbaaxt4c1_kZOveeHeNzasemC6xTqoV4UEALHqKUjJFANU_0-gHmHm6vJ8W-CW1HTHJWjZcTUBIwebomkCNsM2W4jWT_lWM4RfYv8DEIKOnuFv8bIG7svZf1pI5wPXIiBh4hlH3g1Mb56MHOkdmV7BFvga_cPmyAdhOTi4HHiuB4igp4xQiaCbNn2KMjfhntH0_7jQv5L1khIg4xptucpKDp_UfrPCP11FxJHjdG351eLJnARCGnqeTrFa7oVsazVby-Kd51ih-wob7V87rX6kITGq2DMdMD-uOwiHHk8GWerx5H34vXNCx1u9VE0Dvezm5VYyFH8JsnvWV825ehAqgWGSczkPuSxzkRqW_XTjgZam4u5_1SZFhOyFX3n3RndaGpzenL64-Lkl8Xpz-ZhAenztbPJL-wgHelY9GR840FIa0xCvJ2aTaM3I3ozi95lGJ-1OvgY4SG5yZIi3P8NruJhFA' },
		{ label: 'SkillFacts', href: 'https://skillfacts.dev/v#sf1.eNqdUstu2zAQ_BVhz3qk7aEAb0HaFEWNJmh8CwJjTa0kxhQp7C7lGoH_vSCNIjn0kt5EYTAzOzMvsIL5UEPAmcDAbeSRtozOQw09reTjQgwGblDRn0SrgoAaVmJxMYCBq_ZTewU1iKImAQNo1a0Z452lIJn3ekE7UfOxAA8u9GDAJpbIjRycz2pL4iUW8NcwRLZU6UTVq6Hqc7NMKFR5N5A9WU8Vhr6a0QVFF6p2yFDN0O4Y-TD4eNwpoz24MLbPEkOFUjjlJEpzFYeKyUbuszjHlQIGS2BeQGLi_AWT6iKm60anU9q3Ns7d3yCa4qzZbG66V-Fyxt47mf4V2rkGF0Q5WXUxyI4J7VT0JvIeDNDvxTvrFGoIpPkIMODmxTvKJgfn6eIdDDBh3xzZaeHVGH0mHIgpWOrBPL7bfLf3cd_lPLvZLo0Qr8Td9u5us7u9vtk-tHM2MZLe5xq-JdeXvGrgFK5TX2wLIdtpQyIxSF4Jetej5gZLDxmSxpFEH9IeRwr6hWyclyguZ3Lh39K8eFS6vH7S8Z7jM1n94ewhDsPl9y-SNNMDSV7h9zexwlMN-xR6T_0OWd2AVgXM41MNNDKJ5MSVPM2kfAIDIQYqaxd1AS8c5vHpXMMUZ1pwfLuE17jantZ8PBXzsVD9x16UU7CouTLlROc_WmVEBg' }
	],
	topics: [],
	paths: [{ url: '/docs', dir: 'docs/dist' }]
});
