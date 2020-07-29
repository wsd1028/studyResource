function encrypt(word, keyStr) {
	keyStr = keyStr ? keyStr : 'abcdefgabcdefg12'
	var key = CryptoJS.enc.Utf8.parse(keyStr)
	var srcs = CryptoJS.enc.Utf8.parse(word)
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {
	  mode: CryptoJS.mode.ECB,
	  padding: CryptoJS.pad.Pkcs7
	})
	return encrypted.ciphertext.toString()
  }

  console.log(encrypt(13980397321))