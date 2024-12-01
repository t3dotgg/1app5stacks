[<AutoOpen>]
module FSharpFunBlazor.View.Entry

open Microsoft.AspNetCore.Components.Web
open Fun.Blazor

let entry = fragment {
    doctype "html"
    html' {
        lang "EN"
        head {
            baseUrl "/"
            viewport "width=device-width, initial-scale=1.0"
            chartsetUTF8
            link {
                rel "icon"
                type' "image/png"
                href "favicon.png"
            }
            stylesheet "index.css"
            HeadOutlet'' { interactiveServer }
        }
        body {
            div {
                class' "antialiased bg-gray-950 text-white flex flex-col justify-between min-h-screen min-w-screen border-t-2 border-blue-600"
                header {
                    class' "py-4 px-8"
                    div {
                        class' "flex items-center justify-between"
                        div {
                            class' "flex items-baseline"
                            a {
                                href "/"
                                class' "font-bold text-3xl"
                                "round"
                                span {
                                    class' "text-blue-600"
                                    "est"
                                }
                                span {
                                    class' "text-gray-400 font-extralight pl-2 text-2xl"
                                    "(FSharp + Fun.Blazor)"
                                }
                            }
                        }
                        nav {
                            class' "flex flex-row items-center gap-8"
                            a {
                                href "/results"
                                class' "hover:underline text-lg"
                                "Results"
                            }
                        }
                    }
                }
                main {
                    class' "flex-1"
                    html.blazor<Routes> (RenderMode.InteractiveServer)
                }
                footer {
                    class' "font-light text-center py-3 text-gray-500"
                    a {
                        href "https://github.com/t3dotgg/1app5stacks"
                        target "_blank"
                        rel "noopener noreferrer"
                        "GitHub"
                    }
                }
            }
            script { src "_framework/blazor.server.js" }
        }
    }
}
