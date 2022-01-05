// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ChainRunnersBaseRenderer.sol";
import "./RLE.sol";

/*
               ::::                                                                                                                                                  :::#%=
               @*==+-                                                                                                                                               ++==*=.
               #+=#=++..                                                                                                                                        ..=*=*+-#:
                :=+++++++=====================================:    .===============================================. .=========================================++++++++=
                 .%-+%##+=--==================================+=..=+-=============================================-+*+======================================---+##+=#-.
                   -+++@@%++++@@@%+++++++++++++++++++++++++++%#++++++%#+++#@@@#+++++++++@@%++++++++++++++++++++@#+.=+*@*+*@@@@*+++++++++++++++++++++++%@@@#+++#@@+++=
                    -*-#%@@%%%=*%@%*++=++=+==+=++=++=+=++=++==#@%#%#+++=+=*@%*+=+==+=+++%*++==+=++=+==+=++=+=++@%%#%#++++*@%#++=++=++=++=+=++=++=+=+*%%*==*%@@@*:%=
                     :@:+@@@@@@*+++%@@*+===========+*=========#@@========+#%==========*@========##*#*+=======*@##*======#@#+=======*#*============+#%++#@@%#@@#++=.
                      .*+=%@%*%@%##++@@%#=-==-=--==*%=========*%==--=--=-====--=--=-=##=--=-=--%%%%%+=-=--=-=*%=--=--=-=#%=--=----=#%=--=-=--=-+%#+==#%@@*#%@=++.
                        +%.#@@###%@@@@@%*---------#@%########@%*---------------------##---------------------##---------%%*--------@@#---------+#@=#@@#+==@@%*++-
                        .:*+*%@#+=*%@@@*=-------=#%#=-------=%*---------=*#*--------#+=--------===--------=#%*-------=#%*-------==@%#--------=%@@%#*+=-+#%*+*:.
       ====================%*.@@%#==+##%@*=----------------+@#+---------@@*-------=*@+---------@@*--------=@+--------+@=--------*@@+-------+#@@%#==---+#@.*%====================
     :*=--==================-:=#@@%*===+*@%+=============%%%@=========*%@*========+@+=--=====+%@+==========@+========+@========*%@@+======%%%**+=---=%@#=:-====================-#-
       +++**%@@@#*****************@#*=---=##%@@@@@@@@@@@@@#**@@@@****************%@@*+++@#***********#@************************************+=------=*@#*********************@#+=+:
        .-##=*@@%*----------------+%@%=---===+%@@@@@@@*+++---%#++----------------=*@@*+++=-----------=+#=------------------------------------------+%+--------------------+#@-=@
         :%:#%#####+=-=-*@@+--=-==-=*@=--=-==-=*@@#*=-==-=-+@===-==-=-=++==-=-==--=@%===-==----+-==-==--+*+-==-==---=*@@@@@@%#===-=-=+%@%-==-=-==-#@%=-==-==--+#@@@@@@@@@@@@*+++
        =*=#@#=----==-=-=++=--=-==-=*@=--=-==-=*@@+-=-==-==+@===-=--=-*@@*=-=-==--+@=--=-==--+#@-==-==---+%-==-==---=+++#@@@#--==-=-=++++-=--=-===#%+=-==-==---=++++++++@@@%.#*
        +#:@%*===================++%#=========%@%=========#%=========+#@%+=======#%==========*@#=========*%=========+*+%@@@+========+*==========+@@%+**+================*%#*=+=
       *++#@*+=++++++*#%*+++++=+++*%%++++=++++%%*=+++++++##*=++++=++=%@@++++=++=+#%++++=++++#%@=+++++++=*#*+++++++=#%@@@@@*++=++++=#%@*+++=++=+++@#*****=+++++++=+++++*%@@+:=+=
    :=*=#%#@@@@#%@@@%#@@#++++++++++%%*+++++++++++++++++**@*+++++++++*%#++++++++=*##++++++++*%@%+++++++++##+++++++++#%%%%%%++++**#@@@@@**+++++++++++++++++=*%@@@%#@@@@#%@@@%#@++*:.
    #*:@#=-+%#+:=*@*=-+@%#++++++++#%@@#*++++++++++++++#%@#*++++++++*@@#+++++++++@#++++++++*@@#+++++++++##*+++++++++++++++++###@@@@++*@@#+++++++++++++++++++*@@#=:+#%+--+@*=-+%*.@=
    ++=#%#+%@@%=#%@%#+%%#++++++*#@@@%###**************@@@++++++++**#@##*********#*********#@@#++++++***@#******%@%#*++**#@@@%##+==+++=*#**********%%*++++++++#%#=%@@%+*%@%*+%#*=*-
     .-*+===========*@@+++++*%%%@@@++***************+.%%*++++#%%%@@%=:=******************--@@#+++*%%@#==+***--*@%*++*%@@*===+**=--   -************++@%%#++++++#@@@*==========*+-
        =*******##.#%#++++*%@@@%+==+=             *#-%@%**%%###*====**-               -@:*@@##@###*==+**-.-#=+@@#*@##*==+***=                     =+=##%@*+++++*%@@#.#%******:
               ++++%#+++*#@@@@+++==.              **-@@@%+++++++===-                 -+++#@@+++++++==:  :+++%@@+++++++==:                          .=++++@%##++++@@%++++
             :%:*%%****%@@%+==*-                .%==*====**+...                      #*.#+==***....    #+=#%+==****:.                                ..-*=*%@%#++*#%@=+%.
            -+++#%+#%@@@#++===                  .@*++===-                            #%++===           %#+++===                                          =+++%@%##**@@*.@:
          .%-=%@##@@%*==++                                                                                                                                 .*==+#@@%*%@%=*=.
         .+++#@@@@@*++==.                                                                                                                                    -==++#@@@@@@=+%
       .=*=%@@%%%#=*=.                                                                                                                                          .*+=%@@@@%+-#.
       @=-@@@%:++++.                                                                                                                                              -+++**@@#+*=:
    .-+=*#%%++*::.                                                                                                                                                  :+**=#%@#==#
    #*:@*+++=:                                                                                                                                                          =+++@*++=:
  :*-=*=++..                                                                                                                                                             .=*=#*.%=
 +#.=+++:                                                                                                                                                                   ++++:+#
*+=#-::                                                                                                                                                                      .::*+=*

*/

contract ChainRunnersRLERenderer is ChainRunnersBaseRenderer {
    function getTokenData(uint256 _dna)
        public
        view
        override
        returns (
            Layer[NUM_LAYERS] memory tokenLayers,
            Color[NUM_COLORS][NUM_LAYERS] memory tokenPalettes,
            uint8 numTokenLayers,
            string[NUM_LAYERS] memory traitTypes
        )
    {
        uint16[NUM_LAYERS] memory dna = splitNumber(_dna);
        uint16 raceIndex = getRaceIndex(dna[1]);

        bool hasFaceAcc = dna[7] < (10000 - WEIGHTS[raceIndex][7][7]);
        bool hasMask = dna[8] < (10000 - WEIGHTS[raceIndex][8][7]);
        bool hasHeadBelow = dna[9] < (10000 - WEIGHTS[raceIndex][9][36]);
        bool hasHeadAbove = dna[11] < (10000 - WEIGHTS[raceIndex][11][48]);
        bool useHeadAbove = (dna[0] % 2) > 0;
        for (uint8 i = 0; i < NUM_LAYERS; i++) {
            Layer memory layer = layers[i][getLayerIndex(dna[i], i, raceIndex)];
            if (layer.hexString.length > 0) {
                /*
                These conditions help make sure layer selection meshes well visually.
                1. If mask, no face/eye acc/mouth acc
                2. If face acc, no mask/mouth acc/face
                3. If both head above & head below, randomly choose one
                */
                if (
                    ((i == 2 || i == 12) && !hasMask && !hasFaceAcc) ||
                    (i == 7 && !hasMask) ||
                    (i == 10 && !hasMask) ||
                    (i < 2 || (i > 2 && i < 7) || i == 8 || i == 9 || i == 11)
                ) {
                    if (
                        (hasHeadBelow &&
                            hasHeadAbove &&
                            (i == 9 && useHeadAbove)) ||
                        (i == 11 && !useHeadAbove)
                    ) continue;
                    layer.hexString = RLE.decode(layer.hexString);
                    tokenLayers[numTokenLayers] = layer;
                    tokenPalettes[numTokenLayers] = palette(
                        tokenLayers[numTokenLayers].hexString
                    );
                    traitTypes[numTokenLayers] = [
                        "QmFja2dyb3VuZCAg",
                        "UmFjZSAg",
                        "RmFjZSAg",
                        "TW91dGgg",
                        "Tm9zZSAg",
                        "RXllcyAg",
                        "RWFyIEFjY2Vzc29yeSAg",
                        "RmFjZSBBY2Nlc3Nvcnkg",
                        "TWFzayAg",
                        "SGVhZCBCZWxvdyAg",
                        "RXllIEFjY2Vzc29yeSAg",
                        "SGVhZCBBYm92ZSAg",
                        "TW91dGggQWNjZXNzb3J5"
                    ][i];
                    numTokenLayers++;
                }
            }
        }
        return (tokenLayers, tokenPalettes, numTokenLayers, traitTypes);
    }
}
