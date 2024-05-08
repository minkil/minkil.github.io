class StringConverter
{    
    decode(decoder, buffer){
       return decoder.decode(buffer);
    }
    buffer(c){
        if(c instanceof Array)
           return c;
        return [c];
    }
    decodeString(str) { 
        let decoderIso8859_1 = new TextDecoder("ISO-8859-1");
        let decoderUTF16 = new TextDecoder("UTF-16BE");
        //let decoderUTF32 = new TextDecoder("UTF-32");

        var characterArray = str;
        var decodedString = "";

        var codePoint =0;
        var index = -1;

        while (index < characterArray.length - 1)
        {
            index++;
            //codePoint = characterArray[index];// Character.codePointAt(characterArray, index);
            codePoint =characterArray.charCodeAt(index)
            if (codePoint < 32 || codePoint > 126)
            {
                return null;
            }

            // single apostroph is encoded as two consecutive apostrophes
            if (characterArray[index] == '\'')
            {
                decodedString += "\'";
                index++;
            }
            else if (characterArray[index] == '\\')
            {
                index++;
                if (characterArray[index] == '\\')
                { // not a control sequence but a normal back slash
                    decodedString += "\\";
                }
                else if (characterArray[index] == 'S')
                {
                    index++;
                    if (extendedCodePage)
                        decodedString += this.decode(decoder, buffer(characterArray[++index]));
                    else
                        decodedString += (char)(characterArray[++index] + 128);
                } 
                else if (characterArray[index] == 'X')
                {
                    index++;
                    if (characterArray[index] == '\\')
                    {
                        let c = parseInt("" + characterArray[++index] + characterArray[++index], NumberStyles.HexNumber);
                        
                        decodedString += this.decode(decoderIso8859_1, buffer(c)); 
                    }
                    else if (characterArray[index] == '2')
                    {
                        index++;
                        // UTF-16BE (UCS-2)
                        let codePoints=[];
                        do
                        {  
                            codePoints[0] = parseInt("0x" + characterArray[++index] + characterArray[++index]);
                            codePoints[1] = parseInt("0x" + characterArray[++index] + characterArray[++index]); 
                            decodedString = decodedString + this.decode(decoderUTF16, new Uint8Array(codePoints));

                        } while (characterArray[index + 1] != '\\'); // \X0\ is
                        // the
                        // end
                        // signal
                        index += 4; // . Second HEX-number is optional.
                    }
                    else if (characterArray[index] == '4')
                    {
                        index++;
                        // UTF32 (UCS-4)
                        let codePoints =[];
                        do
                        { 
                            codePoints[0] = parseInt("0x" + characterArray[++index] + characterArray[++index]);
                            codePoints[1] = parseInt("0x" + characterArray[++index] + characterArray[++index]);
                            codePoints[2] = parseInt("0x" + characterArray[++index] + characterArray[++index]);
                            codePoints[3] = parseInt("0x" + characterArray[++index] + characterArray[++index]);
                            //decodedString = decodedString + decode(decoderUTF32, buffer(codePoints));

                        } while (characterArray[index + 1] != '\\'); // \X0\ is
                        // the
                        // end
                        // signal
                        index += 4;
                    }
                }
            }
            else
                decodedString = decodedString + characterArray[index]; ;
        }
        return decodedString; 
    }    
}