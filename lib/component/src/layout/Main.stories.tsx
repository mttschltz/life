import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Box } from './Box'
import styled from 'styled-components'
import { Text } from '@component'
import { Main } from './Main'

const Divider = styled.div`
  max-width: 30rem;
  padding-bottom: 3rem;
`

/* eslint-disable react/no-unescaped-entities */
const Simple: ComponentStory<typeof Main> = () => {
  return (
    <>
      <Divider>
        <Main>
          <Box>Text one</Box>
          <Box>Text two</Box>
        </Main>
      </Divider>
      <Divider>
        <Main>
          <Text>
            Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans. Many a
            brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for
            so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great
            Achilles, first fell out with one another.
          </Text>

          <Text>
            And which of the gods was it that set them on to quarrel? It was the son of Jove and Leto; for he was angry
            with the king and sent a pestilence upon the host to plague the people, because the son of Atreus had
            dishonoured Chryses his priest. Now Chryses had come to the ships of the Achaeans to free his daughter, and
            had brought with him a great ransom: moreover he bore in his hand the sceptre of Apollo wreathed with a
            suppliant's wreath and he besought the Achaeans, but most of all the two sons of Atreus, who were their
            chiefs.
          </Text>

          <Text>
            "Sons of Atreus," he cried, "and all other Achaeans, may the gods who dwell in Olympus grant you to sack the
            city of Priam, and to reach your homes in safety; but free my daughter, and accept a ransom for her, in
            reverence to Apollo, son of Jove."
          </Text>

          <Text>
            On this the rest of the Achaeans with one voice were for respecting the priest and taking the ransom that he
            offered; but not so Agamemnon, who spoke fiercely to him and sent him roughly away. "Old man," said he, "let
            me not find you tarrying about our ships, nor yet coming hereafter. Your sceptre of the god and your wreath
            shall profit you nothing. I will not free her. She shall grow old in my house at Argos far from her own
            home, busying herself with her loom and visiting my couch; so go, and do not provoke me or it shall be the
            worse for you."
          </Text>

          <Text>
            The old man feared him and obeyed. Not a word he spoke, but went by the shore of the sounding sea and prayed
            apart to King Apollo whom lovely Leto had borne. "Hear me," he cried, "O god of the silver bow, that
            protectest Chryse and holy Cilla and rulest Tenedos with thy might, hear me oh thou of Sminthe. If I have
            ever decked your temple with garlands, or burned your thigh-bones in fat of bulls or goats, grant my prayer,
            and let your arrows avenge these my tears upon the Danaans."
          </Text>

          <Text>
            Thus did he pray, and Apollo heard his prayer. He came down furious from the summits of Olympus, with his
            bow and his quiver upon his shoulder, and the arrows rattled on his back with the rage that trembled within
            him. He sat himself down away from the ships with a face as dark as night, and his silver bow rang death as
            he shot his arrow in the midst of them. First he smote their mules and their hounds, but presently he aimed
            his shafts at the people themselves, and all day long the pyres of the dead were burning.
          </Text>

          <Text>
            For nine whole days he shot his arrows among the people, but upon the tenth day Achilles called them in
            assembly- moved thereto by Juno, who saw the Achaeans in their death-throes and had compassion upon them.
            Then, when they were got together, he rose and spoke among them.
          </Text>

          <Text>
            "Son of Atreus," said he, "I deem that we should now turn roving home if we would escape destruction, for we
            are being cut down by war and pestilence at once. Let us ask some priest or prophet, or some reader of
            dreams (for dreams, too, are of Jove) who can tell us why Phoebus Apollo is so angry, and say whether it is
            for some vow that we have broken, or hecatomb that we have not offered, and whether he will accept the
            savour of lambs and goats without blemish, so as to take away the plague from us."
          </Text>

          <Text>
            With these words he sat down, and Calchas son of Thestor, wisest of augurs, who knew things past present and
            to come, rose to speak. He it was who had guided the Achaeans with their fleet to Ilius, through the
            prophesyings with which Phoebus Apollo had inspired him. With all sincerity and goodwill he addressed them
            thus:-
          </Text>

          <Text>
            "Achilles, loved of heaven, you bid me tell you about the anger of King Apollo, I will therefore do so; but
            consider first and swear that you will stand by me heartily in word and deed, for I know that I shall offend
            one who rules the Argives with might, to whom all the Achaeans are in subjection. A plain man cannot stand
            against the anger of a king, who if he swallow his displeasure now, will yet nurse revenge till he has
            wreaked it. Consider, therefore, whether or no you will protect me."
          </Text>

          <Text>
            And Achilles answered, "Fear not, but speak as it is borne in upon you from heaven, for by Apollo, Calchas,
            to whom you pray, and whose oracles you reveal to us, not a Danaan at our ships shall lay his hand upon you,
            while I yet live to look upon the face of the earth- no, not though you name Agamemnon himself, who is by
            far the foremost of the Achaeans."
          </Text>

          <Text>
            Thereon the seer spoke boldly. "The god," he said, "is angry neither about vow nor hecatomb, but for his
            priest's sake, whom Agamemnon has dishonoured, in that he would not free his daughter nor take a ransom for
            her; therefore has he sent these evils upon us, and will yet send others. He will not deliver the Danaans
            from this pestilence till Agamemnon has restored the girl without fee or ransom to her father, and has sent
            a holy hecatomb to Chryse. Thus we may perhaps appease him."
          </Text>

          <Text>
            With these words he sat down, and Agamemnon rose in anger. His heart was black with rage, and his eyes
            flashed fire as he scowled on Calchas and said, "Seer of evil, you never yet prophesied smooth things
            concerning me, but have ever loved to foretell that which was evil. You have brought me neither comfort nor
            performance; and now you come seeing among Danaans, and saying that Apollo has plagued us because I would
            not take a ransom for this girl, the daughter of Chryses. I have set my heart on keeping her in my own
            house, for I love her better even than my own wife Clytemnestra, whose peer she is alike in form and
            feature, in understanding and accomplishments. Still I will give her up if I must, for I would have the
            people live, not die; but you must find me a prize instead, or I alone among the Argives shall be without
            one. This is not well; for you behold, all of you, that my prize is to go elsewhither."
          </Text>

          <Text>
            And Achilles answered, "Most noble son of Atreus, covetous beyond all mankind, how shall the Achaeans find
            you another prize? We have no common store from which to take one. Those we took from the cities have been
            awarded; we cannot disallow the awards that have been made already. Give this girl, therefore, to the god,
            and if ever Jove grants us to sack the city of Troy we will requite you three and fourfold."
          </Text>

          <Text>
            Then Agamemnon said, "Achilles, valiant though you be, you shall not thus outwit me. You shall not overreach
            and you shall not persuade me. Are you to keep your own prize, while I sit tamely under my loss and give up
            the girl at your bidding? Let the Achaeans find me a prize in fair exchange to my liking, or I will come and
            take your own, or that of Ajax or of Ulysses; and he to whomsoever I may come shall rue my coming. But of
            this we will take thought hereafter; for the present, let us draw a ship into the sea, and find a crew for
            her expressly; let us put a hecatomb on board, and let us send Chryseis also; further, let some chief man
            among us be in command, either Ajax, or Idomeneus, or yourself, son of Peleus, mighty warrior that you are,
            that we may offer sacrifice and appease the the anger of the god."
          </Text>

          <Text>
            Achilles scowled at him and answered, "You are steeped in insolence and lust of gain. With what heart can
            any of the Achaeans do your bidding, either on foray or in open fighting? I came not warring here for any
            ill the Trojans had done me. I have no quarrel with them. They have not raided my cattle nor my horses, nor
            cut down my harvests on the rich plains of Phthia; for between me and them there is a great space, both
            mountain and sounding sea. We have followed you, Sir Insolence! for your pleasure, not ours- to gain
            satisfaction from the Trojans for your shameless self and for Menelaus. You forget this, and threaten to rob
            me of the prize for which I have toiled, and which the sons of the Achaeans have given me. Never when the
            Achaeans sack any rich city of the Trojans do I receive so good a prize as you do, though it is my hands
            that do the better part of the fighting. When the sharing comes, your share is far the largest, and I,
            forsooth, must go back to my ships, take what I can get and be thankful, when my labour of fighting is done.
            Now, therefore, I shall go back to Phthia; it will be much better for me to return home with my ships, for I
            will not stay here dishonoured to gather gold and substance for you."
          </Text>

          <Text>
            And Agamemnon answered, "Fly if you will, I shall make you no prayers to stay you. I have others here who
            will do me honour, and above all Jove, the lord of counsel. There is no king here so hateful to me as you
            are, for you are ever quarrelsome and ill affected. What though you be brave? Was it not heaven that made
            you so? Go home, then, with your ships and comrades to lord it over the Myrmidons. I care neither for you
            nor for your anger; and thus will I do: since Phoebus Apollo is taking Chryseis from me, I shall send her
            with my ship and my followers, but I shall come to your tent and take your own prize Briseis, that you may
            learn how much stronger I am than you are, and that another may fear to set himself up as equal or
            comparable with me."
          </Text>
        </Main>
      </Divider>
    </>
  )
}
/* eslint-enable react/no-unescaped-entities */

export { Simple }

// eslint-disable-next-line import/no-default-export
export default {
  title: 'Layout/Main',
  component: Main,
} as ComponentMeta<typeof Main>
