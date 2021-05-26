export const getIconFromSrc = (src: string) => {
  const codeStr = src.split("/").pop()?.split(".")[0]
  if (!codeStr) {
    return null
  }
  const codes = codeStr?.split("-").map(code => "0x" + code)

  return String.fromCodePoint(...codes as unknown[] as number[])
}