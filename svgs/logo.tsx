import * as React from "react"
import Svg, {
    SvgProps,
    Defs,
    Path,
    G,
    Use,
    ClipPath,
    Text,
    TSpan,
} from "react-native-svg"

function LogoSvg(props: SvgProps) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="none"
            width="1em"
            height="1em"
            viewBox="0 0 51 51"
            {...props}
        >
            <Defs>
                <Path
                    fill="#FFF"
                    d="M74 38.05q0-15-15-15H39q-15 0-15 15v20q0 15 15 15h20q15 0 15-15v-20z"
                    id="prefix__a"
                />
                <Path
                    id="prefix__b"
                    stroke="#000"
                    strokeWidth={1}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    d="M39 23.05h20q15 0 15 15v20q0 15-15 15H39q-15 0-15-15v-20q0-15 15-15z"
                />
            </Defs>
            <G transform="translate(-23.4 -22.45)">
                <Use xlinkHref="#prefix__a" />
                <Use xlinkHref="#prefix__b" />
            </G>
            <G transform="translate(11.65 24.05)">
                <ClipPath id="prefix__c">
                    <Path fill="#FFF" d="M-2-2h40.95v28.55H-2z" />
                </ClipPath>
                <Text clipPath="url(#prefix__c)" writingMode="lr">
                    <TSpan
                        x={0}
                        y={19.9}
                        baselineShift="0%"
                        fontFamily="Arial"
                        fontSize={22}
                        fill="#000"
                    >
                        {"p4p"}
                    </TSpan>
                </Text>
            </G>
        </Svg>
    )
}

export default LogoSvg
