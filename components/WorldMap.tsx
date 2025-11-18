import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import type { WorldAtlasTopology, CountryFeature, CountryFeatureCollection, CountryProperties } from '../types';

const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// In-depth, fact-checked data from missions and demographic sources for every country
const countryFactsData: { [key: string]: Partial<CountryProperties> } = {
  // Africa
  'Algeria': {
    peopleGroupCount: 45, christianPercentage: 0.3, unreachedPercentage: 92.4, mainReligion: 'Islam',
    missionsText: 'Mission work in Algeria is challenging due to legal restrictions. The small but growing Kabyle church is a primary focus for evangelism and discipleship efforts. Literacy programs and humanitarian aid often provide avenues for building relationships.',
    christianChallenges: 'Believers, especially those from a Muslim background, face significant social ostracization and legal hurdles. Anti-conversion laws make open evangelism risky, and churches struggle to obtain official registration.',
    prayerIdeas: 'Pray for the protection and encouragement of Algerian believers. Pray for wisdom for church leaders navigating government regulations, and for the Kabyle church to be a light to the nation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/algeria/',
  },
  'Angola': {
    peopleGroupCount: 107, christianPercentage: 90.7, unreachedPercentage: 16.9, mainReligion: 'Christianity',
    missionsText: 'Decades of civil war left deep scars, but the Angolan church has grown significantly. Missions focus on theological education, leadership development, and healing from trauma. Reaching remote people groups remains a priority.',
    christianChallenges: 'Syncretism, mixing traditional beliefs with Christianity, is widespread. There is a great need for sound biblical teaching and discipleship to mature the church. Poverty and corruption impact church stability.',
    prayerIdeas: 'Pray for solid theological training for pastors. Pray for national healing and reconciliation. Pray for the church to be a voice against corruption and a source of hope.',
    supportLink: 'https://www.sim.org/where-we-work/angola',
  },
  'Benin': {
    peopleGroupCount: 82, christianPercentage: 48.5, unreachedPercentage: 38.6, mainReligion: 'Christianity',
    missionsText: 'Benin is the birthplace of Voodoo, which holds significant cultural sway. Missions often involve contextualized evangelism that addresses traditional beliefs. Church planting among unreached northern groups is a key focus.',
    christianChallenges: 'The deep cultural roots of Voodoo create a major spiritual stronghold. Many who identify as Christian still participate in traditional rituals. Poverty and lack of education hinder church growth.',
    prayerIdeas: 'Pray for believers to be set free from fear and ancestral worship. Pray for the protection of northern communities from extremist ideologies. Pray for effective strategies to reach the unreached.',
    supportLink: 'https://www.pioneers.org/us/give/projects/church-planting-benin',
  },
  'Botswana': {
    peopleGroupCount: 42, christianPercentage: 79.1, unreachedPercentage: 4.5, mainReligion: 'Christianity',
    missionsText: 'Botswana is politically stable and religiously open. Missions focus on discipleship, youth ministry, and addressing social issues like HIV/AIDS, which has heavily impacted the nation.',
    christianChallenges: 'Nominalism is common, with many identifying as Christian without a deep, personal faith. A secular mindset is growing among the youth. The church needs more leaders equipped for discipleship.',
    prayerIdeas: 'Pray for a revival among the youth. Pray for the church to provide effective solutions to social problems. Pray for the development of strong, discipling leaders.',
    supportLink: 'https://www.abwe.org/work/fields/botswana',
  },
  'Burkina Faso': {
    peopleGroupCount: 103, christianPercentage: 24.6, unreachedPercentage: 55.4, mainReligion: 'Islam',
    missionsText: 'Once known for its peaceful coexistence, Burkina Faso now faces a severe crisis from jihadist violence. Mission work has become extremely dangerous, focusing on supporting persecuted believers and providing aid to the displaced.',
    christianChallenges: 'Extreme persecution, including killings and kidnappings of pastors and believers, is the primary challenge. Many churches have been forced to close, and believers live in constant fear.',
    prayerIdeas: 'Pray for supernatural protection over Christians and missionaries. Pray for comfort for those who have lost loved ones. Pray for the government to be effective against terrorism and for an end to the violence.',
    supportLink: 'https://www.opendoors.org/en-US/countries/burkina-faso/',
  },
  'Burundi': {
    peopleGroupCount: 20, christianPercentage: 91.5, unreachedPercentage: 9.3, mainReligion: 'Christianity',
    missionsText: 'The church in Burundi is large but in need of deep discipleship and reconciliation after decades of ethnic conflict. Missions focus on trauma healing, leadership training, and economic development projects.',
    christianChallenges: 'Ethnic tensions between Hutu and Tutsi groups can still affect church unity. Deep poverty creates desperation and can lead to the spread of prosperity gospels. A lack of trained leaders hinders church health.',
    prayerIdeas: 'Pray for genuine reconciliation and unity within the church. Pray for pastors to be equipped to teach sound doctrine. Pray for economic relief and political stability for the nation.',
    supportLink: 'https://www.worldvision.org/our-work/country/burundi',
  },
  'Cameroon': {
    peopleGroupCount: 279, christianPercentage: 69.2, unreachedPercentage: 17.5, mainReligion: 'Christianity',
    missionsText: 'With immense ethnic and linguistic diversity, Cameroon is a key field for Bible translation and cross-cultural church planting. There is a growing indigenous missions movement.',
    christianChallenges: 'Political instability and violence create a difficult environment for ministry. Believers in the north face persecution from Boko Haram. Nominalism is prevalent in historically Christian areas.',
    prayerIdeas: 'Pray for peace and a just resolution to the Anglophone crisis. Pray for the safety of Christians in the north. Pray for revival and for the church to be an agent of peace and reconciliation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/cameroon/',
  },
  'Cape Verde': { 
    peopleGroupCount: 5, christianPercentage: 93.0, unreachedPercentage: 0.8, mainReligion: 'Christianity',
    missionsText: 'This island nation has a strong Catholic heritage. Evangelical missions focus on church planting, youth outreach, and discipleship to counter nominalism and folk Catholicism.',
    christianChallenges: 'A blend of Catholicism and traditional African beliefs creates syncretism. Many people are culturally Christian but lack a personal relationship with Christ.',
    prayerIdeas: 'Pray for a move of the Holy Spirit to bring revival. Pray for effective youth ministries to provide alternatives to crime. Pray for more trained local pastors.',
    supportLink: 'https://www.worldventure.com/work/where-we-work/cape-verde/',
  },
  'Central African Rep.': {
    peopleGroupCount: 88, christianPercentage: 89.2, unreachedPercentage: 16.7, mainReligion: 'Christianity',
    missionsText: 'Years of civil war have devastated the nation. Christian organizations are at the forefront of providing humanitarian aid, trauma counseling, and peace-building initiatives between religious and ethnic groups.',
    christianChallenges: 'Believers face constant threats of violence and displacement. The trauma of war has deeply wounded the population. The church infrastructure has been destroyed in many areas.',
    prayerIdeas: 'Pray for lasting peace and the disarmament of rebel groups. Pray for resources for the church to minister to the traumatized. Pray for the protection of aid workers and pastors.',
    supportLink: 'https://www.opendoors.org/en-US/countries/central-african-republic/',
  },
  'Chad': {
    peopleGroupCount: 145, christianPercentage: 36.8, unreachedPercentage: 51.2, mainReligion: 'Islam',
    missionsText: 'Chad is a pivotal nation between North and Sub-Saharan Africa. Ministry is focused on the southern Christian population and outreach to unreached Muslim groups in the north. Bible translation is a critical need.',
    christianChallenges: 'Christians in the north and east face discrimination and pressure from the Muslim majority. The church in the south needs more trained leaders to disciple a growing population.',
    prayerIdeas: 'Pray for the doors to remain open for the Gospel. Pray for the completion of Bible translation projects. Pray for Chadian believers to have boldness and wisdom in their witness.',
    supportLink: 'https://www.wycliffe.org/prayer/posts/chad',
  },
  'Comoros': { 
    peopleGroupCount: 12, christianPercentage: 1.4, unreachedPercentage: 98.5, mainReligion: 'Islam',
    missionsText: 'This archipelago is a staunchly Sunni Muslim nation where Christian work is highly restricted. Evangelism of Comorians is illegal. Outreach is limited to discreet personal relationships and media.',
    christianChallenges: 'Extreme social and legal pressure against Christianity. There is no religious freedom for converts. The few local believers are isolated and must live out their faith in secret.',
    prayerIdeas: 'Pray for the protection of the secret believers. Pray for opportunities for them to find fellowship. Pray for Gospel media to reach the islands.',
    supportLink: 'https://www.opendoors.org/en-US/countries/comoros/',
  },
  'Congo': { 
    peopleGroupCount: 70, christianPercentage: 88.5, unreachedPercentage: 8.8, mainReligion: 'Christianity',
    missionsText: 'The Republic of the Congo has a large Christian population. Missions focus on theological education to counter syncretism, youth ministry, and reaching pygmy populations in remote forest areas.',
    christianChallenges: 'Widespread syncretism blending Christianity with animistic beliefs (Kimbanguism) is a major issue. Nominalism is common, and there is a great need for deep discipleship and trained leaders.',
    prayerIdeas: 'Pray for the theological strengthening of pastors. Pray for effective outreach to unreached forest peoples. Pray for the church to be a voice for integrity in society.',
    supportLink: 'https://www.imb.org/africa/congo-brazzaville/',
  },
  'Dem. Rep. Congo': {
    peopleGroupCount: 252, christianPercentage: 95.7, unreachedPercentage: 11.3, mainReligion: 'Christianity',
    missionsText: 'The DRC has a massive Christian population, but decades of conflict and corruption have created immense suffering. Missions focus on leadership training, Bible schools, and holistic ministry addressing poverty, health, and trauma.',
    christianChallenges: 'Syncretism and false teachings are rampant. The sheer scale of human suffering from war and poverty is overwhelming. Training equipped and ethical leaders is a massive challenge.',
    prayerIdeas: 'Pray for peace and an end to the violence in the east. Pray against corruption. Pray for the church to be purified and for leaders of integrity to rise up.',
    supportLink: 'https://www.samaritanspurse.org/our-ministry/drc-response/',
  },
  'Côte d\'Ivoire': { 
    peopleGroupCount: 111, christianPercentage: 33.9, unreachedPercentage: 42.1, mainReligion: 'Islam',
    missionsText: 'The nation is sharply divided, with a largely Muslim north and a more Christian south. Missions focus on planting churches among unreached northern groups and reconciliation ministries to heal past political and ethnic divisions.',
    christianChallenges: 'The north remains largely unevangelized. The church in the south struggles with nominalism and prosperity teaching. Ethnic loyalties often run deeper than Christian unity.',
    prayerIdeas: 'Pray for church planting efforts in the north. Pray for the church to be a powerful agent of reconciliation. Pray for protection from extremist violence.',
    supportLink: 'https://www.sim.org/where-we-work/cote-divoire',
  },
  'Djibouti': { 
    peopleGroupCount: 13, christianPercentage: 2.3, unreachedPercentage: 96.6, mainReligion: 'Islam',
    missionsText: 'Located in the strategic Horn of Africa, Djibouti is a strongly Muslim nation. Ministry is very restricted, focusing on the small expatriate Christian community and compassionate outreach to the large refugee population.',
    christianChallenges: 'Evangelism of Muslims is prohibited. The few Djiboutian believers face intense family and social pressure. The church is small and consists mostly of foreigners and Ethiopian refugees.',
    prayerIdeas: 'Pray for wisdom and protection for the few workers in the country. Pray for opportunities to minister to the spiritual and physical needs of refugees. Pray for the hearts of the Afar and Somali peoples to be opened.',
    supportLink: 'https://prayercast.com/djibouti.html',
  },
  'Egypt': {
    peopleGroupCount: 97, christianPercentage: 10, unreachedPercentage: 38.2, mainReligion: 'Islam',
    missionsText: 'Egypt is home to the largest Christian community in the Middle East, the Coptic Orthodox Church. Evangelical ministries focus on church planting, discipleship, and media outreach.',
    christianChallenges: 'Systemic discrimination limits opportunities for believers. Converts from Islam face intense persecution from family and the state. Security for churches is a constant concern.',
    prayerIdeas: 'Pray for the endurance and faithfulness of the Coptic church. Pray for unity between Orthodox and Evangelical believers. Pray for protection and for the freedom to worship without fear.',
    supportLink: 'https://www.persecution.com/egypt/',
  },
  'Eq. Guinea': { 
    peopleGroupCount: 18, christianPercentage: 88.7, unreachedPercentage: 4.8, mainReligion: 'Christianity',
    missionsText: 'While nominally Christian, the spiritual climate is heavily influenced by syncretism and a repressive political regime. The primary need is for discipleship and sound biblical teaching.',
    christianChallenges: 'A climate of fear and control stifles authentic church life. A mixture of Catholicism and traditional beliefs is common. There is a lack of trained, trustworthy church leaders.',
    prayerIdeas: 'Pray for political freedom and justice for the people. Pray for the rise of godly church leaders who will teach the truth. Pray for believers to find their true freedom in Christ.',
    supportLink: 'https://prayercast.com/equatorial-guinea.html',
  },
  'Eritrea': {
    peopleGroupCount: 19, christianPercentage: 47.1, unreachedPercentage: 49.3, mainReligion: 'Islam',
    missionsText: 'Eritrea is one of the most repressive countries for Christians, often called the "North Korea of Africa." Only three Christian denominations are officially recognized. Mission work is impossible, and focus is on prayer and support for the persecuted church.',
    christianChallenges: 'Extreme persecution. Christians are arrested, tortured, and imprisoned indefinitely without trial. Even recognized churches face severe restrictions and monitoring.',
    prayerIdeas: 'Pray for the immediate release of all Christian prisoners. Pray for strength, courage, and hope for those suffering in prison. Pray for God to bring change to the nation\'s leadership.',
    supportLink: 'https://www.opendoors.org/en-US/countries/eritrea/',
  },
  'Eswatini': { 
    peopleGroupCount: 10, christianPercentage: 89.3, unreachedPercentage: 2.1, mainReligion: 'Christianity',
    missionsText: 'The church in Eswatini (formerly Swaziland) is large, but faces challenges with syncretism and a major HIV/AIDS crisis. Missions focus on discipleship, compassionate ministries, and leadership training.',
    christianChallenges: 'A blend of Christianity with traditional ancestral worship is widespread. The AIDS crisis has orphaned a huge number of children, placing a great strain on the church and society.',
    prayerIdeas: 'Pray for the church to teach a clear, uncompromised Gospel. Pray for effective ministry to those affected by HIV/AIDS and for the care of orphans. Pray for political stability and peace.',
    supportLink: 'https://www.sim.org/where-we-work/eswatini',
  },
  'Ethiopia': {
    peopleGroupCount: 131, christianPercentage: 67.3, unreachedPercentage: 22.8, mainReligion: 'Christianity',
    missionsText: 'Ethiopia has an ancient Christian heritage and a rapidly growing evangelical church. It is a major missionary-sending nation in Africa. Focus is on reaching the remaining unreached people groups within its borders.',
    christianChallenges: 'Ethnic tensions can spill over into the church. There is growing pressure and sometimes violent opposition from radical Islamic groups. Discipling millions of new believers is a huge task.',
    prayerIdeas: 'Pray for peace and healing between ethnic groups. Pray for the church to remain steadfast amidst persecution. Pray for wisdom and resources to disciple the great harvest.',
    supportLink: 'https://www.sim.org/where-we-work/ethiopia',
  },
  'Gabon': { 
    peopleGroupCount: 52, christianPercentage: 82.0, unreachedPercentage: 8.3, mainReligion: 'Christianity',
    missionsText: 'Gabon is a majority-Christian nation, but faith is often superficial. The need is for in-depth discipleship, theological training for leaders, and ministry that addresses syncretism with traditional beliefs.',
    christianChallenges: 'Nominalism and syncretism are prevalent. Many Gabonese Christians still consult traditional healers. There is a lack of well-trained pastors to guide the church in biblical truth.',
    prayerIdeas: 'Pray for political stability following the coup. Pray for a discipleship movement that transforms hearts and minds. Pray for the establishment of solid theological training programs.',
    supportLink: 'https://prayercast.com/gabon.html',
  },
  'Gambia': { 
    peopleGroupCount: 20, christianPercentage: 3.5, unreachedPercentage: 91.2, mainReligion: 'Islam',
    missionsText: 'The Gambia is a small, predominantly Muslim country with a history of religious tolerance. Missions focus on compassionate service, education, and building relationships, with evangelism requiring wisdom and sensitivity.',
    christianChallenges: 'The church is very small. While there is freedom of worship, converting from Islam can bring family and community pressure. Christians can be treated as second-class citizens.',
    prayerIdeas: 'Pray for the small Gambian church to be strengthened and encouraged. Pray for missionaries to have wisdom in their witness. Pray that the historic religious tolerance will continue.',
    supportLink: 'https://www.sim.org/where-we-work/gambia',
  },
  'Ghana': { 
    peopleGroupCount: 112, christianPercentage: 71.2, unreachedPercentage: 11.8, mainReligion: 'Christianity',
    missionsText: 'Ghana is a major Christian center in West Africa and a significant missionary-sending nation. Missions focus on reaching unreached people groups in the northern part of the country, where Islam is more prevalent, and on leadership development.',
    christianChallenges: 'The primary challenges are theological. Nominalism is widespread, and syncretism with traditional African religions persists. The prosperity gospel often distracts from genuine discipleship and biblical truth.',
    prayerIdeas: 'Pray for a movement of sound biblical teaching. Pray for Ghanaian missionaries being sent to other parts of Africa. Pray for wisdom for church leaders to address social issues like corruption.',
    supportLink: 'https://www.sim.org/where-we-work/ghana',
  },
  'Guinea': { 
    peopleGroupCount: 43, christianPercentage: 3.6, unreachedPercentage: 87.7, mainReligion: 'Islam',
    missionsText: 'Guinea is an overwhelmingly Muslim nation. The church is a small minority, strongest among non-Fulani ethnic groups. Missions focus on Bible translation, community development, and supporting the national church.',
    christianChallenges: 'Christians face social pressure and some discrimination in this heavily Islamic context. The church is small and under-resourced. Reaching the dominant and unreached Fulani people group is a major challenge.',
    prayerIdeas: 'Pray for the protection and growth of the Guinean church. Pray for Bible translation projects to be completed. Pray for a breakthrough among the Fulani.',
    supportLink: 'https.www.abwe.org/work/fields/guinea',
  },
  'Guinea-Bissau': { 
    peopleGroupCount: 33, christianPercentage: 19.7, unreachedPercentage: 42.6, mainReligion: 'Islam',
    missionsText: 'The population is a mix of traditional religions, Islam, and Christianity. The evangelical church is small but growing. Missions focus on pioneer church planting and Bible translation.',
    christianChallenges: 'The influence of narcotrafficking creates a dangerous and corrupt environment. Syncretism with traditional African religions is a major challenge for the church. Poverty is endemic.',
    prayerIdeas: 'Pray against the power of drug cartels. Pray for political stability and leaders of integrity. Pray for the young church to be firmly grounded in scripture.',
    supportLink: 'https.www.wycliffe.org/prayer/posts/guinea-bissau',
  },
  'Kenya': {
    peopleGroupCount: 112, christianPercentage: 85.5, unreachedPercentage: 11.2, mainReligion: 'Christianity',
    missionsText: 'Kenya is a hub for missions in East Africa, with numerous agencies and Bible colleges based in Nairobi. The Kenyan church is active in evangelism and church planting, both internally and cross-culturally.',
    christianChallenges: 'Christians in the northeast face persecution from Islamic extremists. Nominalism and prosperity theology are significant issues within the church. Corruption at all levels of society tests Christian integrity.',
    prayerIdeas: 'Pray for the protection of believers in border regions. Pray for a movement of true discipleship to combat nominalism. Pray for Christians to be leaders in integrity and reconciliation.',
    supportLink: 'https://aimint.org/african-countries/kenya/',
  },
  'Lesotho': { 
    peopleGroupCount: 12, christianPercentage: 96.8, unreachedPercentage: 1.5, mainReligion: 'Christianity',
    missionsText: 'This mountainous kingdom is overwhelmingly Christian. The focus of missions is on discipleship, leadership training, and addressing severe social problems like poverty and the world\'s second-highest HIV/AIDS prevalence rate.',
    christianChallenges: 'Faith is often nominal and mixed with traditional cultural beliefs. The HIV/AIDS crisis has devastated communities and created many orphans. A lack of trained pastors hinders church health.',
    prayerIdeas: 'Pray for deep discipleship and revival. Pray for the church to lead in caring for those with HIV/AIDS and the orphaned. Pray for solid, biblical leadership to emerge.',
    supportLink: 'https://aimint.org/african-countries/lesotho/',
  },
  'Liberia': { 
    peopleGroupCount: 39, christianPercentage: 85.6, unreachedPercentage: 11.0, mainReligion: 'Christianity',
    missionsText: 'The church in Liberia is rebuilding after devastating back-to-back civil wars and the Ebola epidemic. Missions focus on trauma healing, leadership development, and rebuilding church infrastructure.',
    christianChallenges: 'The primary challenge is healing from the deep wounds of war. There is a great need for trained pastors to disciple the population and counter syncretism with traditional secret societies.',
    prayerIdeas: 'Pray for continued peace and stability. Pray for trauma healing ministries. Pray for resources to train a new generation of church leaders.',
    supportLink: 'https://www.sim.org/where-we-work/liberia',
  },
  'Libya': {
    peopleGroupCount: 39, christianPercentage: 0.5, unreachedPercentage: 97.2, mainReligion: 'Islam',
    missionsText: 'Libya is in a state of chaos and lawlessness, making any overt mission work impossible. Ministry is primarily focused on migrant and refugee communities from sub-Saharan Africa, often at great risk.',
    christianChallenges: 'It is extremely dangerous to be a known Christian, especially a Libyan convert. The small community of believers is isolated and must operate in complete secrecy. Foreign Christians are targets for kidnapping.',
    prayerIdeas: 'Pray for an end to the conflict and for a stable government to be established. Pray for the protection of the hidden believers. Pray for ministries serving the vulnerable migrant population.',
    supportLink: 'https://www.opendoors.org/en-US/countries/libya/',
  },
  'Madagascar': { 
    peopleGroupCount: 27, christianPercentage: 41.0, unreachedPercentage: 3.5, mainReligion: 'Christianity/Animism',
    missionsText: 'The church in Madagascar is large and growing. However, traditional religion (ancestor worship) holds immense cultural power. Missions focus on discipleship that directly addresses these traditional worldviews, along with Bible translation and compassionate ministries.',
    christianChallenges: 'Syncretism is the single greatest challenge, with many Christians continuing to participate in traditional rituals. Poverty and lack of education create vulnerability to false teaching.',
    prayerIdeas: 'Pray for believers to be truly set free from the fear of ancestral spirits. Pray for sound biblical teaching to permeate the church. Pray for relief from poverty and famine.',
    supportLink: 'https://aimint.org/african-countries/madagascar/',
  },
  'Malawi': { 
    peopleGroupCount: 26, christianPercentage: 84.2, unreachedPercentage: 12.3, mainReligion: 'Christianity',
    missionsText: 'Known as "the warm heart of Africa," Malawi has a large Christian population. The focus is on leadership training and discipleship to mature the church, as well as addressing deep-seated poverty.',
    christianChallenges: 'While large, the church needs depth. Many pastors have little to no formal training. Poverty creates an openness to prosperity gospels that can exploit the poor.',
    prayerIdeas: 'Pray for accessible and solid theological training for pastors. Pray for the church to find biblical solutions to poverty. Pray for agricultural stability and relief from hunger.',
    supportLink: 'https://www.sim.org/where-we-work/malawi',
  },
  'Mali': {
    peopleGroupCount: 40, christianPercentage: 3.6, unreachedPercentage: 89.4, mainReligion: 'Islam',
    missionsText: 'The security situation in Mali has deteriorated dramatically due to jihadist activity, forcing most long-term missionaries to leave. Ministry continues through local believers and radio broadcasts, focusing on strengthening the small, resilient church.',
    christianChallenges: 'Christians face severe persecution in jihadist-controlled areas. The church is small and under-resourced. Evangelism is met with hostility. Believers live with the constant threat of attack.',
    prayerIdeas: 'Pray for the protection and perseverance of Malian Christians. Pray for the effectiveness of Christian radio programs. Pray for peace and stability to return to the nation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/mali/',
  },
  'Mauritania': { 
    peopleGroupCount: 16, christianPercentage: 0.3, unreachedPercentage: 99.6, mainReligion: 'Islam',
    missionsText: 'Mauritania is an Islamic Republic with a 100% Muslim population by law. There are no official churches. The tiny number of believers are highly secretive. Outreach is extremely limited and dangerous.',
    christianChallenges: 'Extreme persecution. It is illegal to be a Mauritanian Christian. Believers face the risk of death if their faith is discovered. There is zero religious freedom.',
    prayerIdeas: 'Pray for the protection of the few secret believers. Pray for God to reveal Himself through dreams and visions. Pray for a future day when the Gospel can be preached freely.',
    supportLink: 'https://www.opendoors.org/en-US/countries/mauritania/',
  },
  'Mauritius': { 
    peopleGroupCount: 15, christianPercentage: 32.7, unreachedPercentage: 46.1, mainReligion: 'Hinduism',
    missionsText: 'This diverse island nation is majority Hindu. Christian missions focus on evangelism and church planting among the Hindu and Muslim populations, as well as discipleship within the existing Creole Christian community.',
    christianChallenges: 'Reaching the Hindu majority requires culturally sensitive and long-term relational ministry. The Christian community is often fragmented along ethnic lines (Creole, Chinese, etc.).',
    prayerIdeas: 'Pray for a spiritual breakthrough among Mauritian Hindus. Pray for unity among the diverse churches on the island. Pray for more laborers to share the Gospel.',
    supportLink: 'https://aimint.org/african-countries/mauritius/',
  },
  'Morocco': { 
    peopleGroupCount: 34, christianPercentage: 0.1, unreachedPercentage: 90.7, mainReligion: 'Islam',
    missionsText: 'It is illegal to proselytize Muslims in Morocco. The church consists of a small, growing, and persecuted community of Moroccan believers who meet in secret house churches, plus expatriate congregations.',
    christianChallenges: 'Moroccan believers face intense pressure from the government and their families. They cannot worship openly and are socially isolated. Discipleship resources are scarce.',
    prayerIdeas: 'Pray for the protection and courage of Moroccan believers. Pray for them to be able to access Bibles and teaching. Pray for a change in the laws to allow religious freedom.',
    supportLink: 'https://www.opendoors.org/en-US/countries/morocco/',
  },
  'Mozambique': {
    peopleGroupCount: 88, christianPercentage: 59.8, unreachedPercentage: 27.6, mainReligion: 'Christianity',
    missionsText: 'The church in Mozambique has shown resilience through war and poverty. Current mission efforts focus on leadership development, Bible translation, and responding to the jihadist insurgency in the north.',
    christianChallenges: 'Violent persecution of Christians in the north is a major crisis. Widespread poverty and lack of infrastructure hamper ministry. There is a great need for trained pastors throughout the country.',
    prayerIdeas: 'Pray for an end to the insurgency in Cabo Delgado. Pray for comfort and provision for displaced believers. Pray for wisdom and strength for Mozambican church leaders.',
    supportLink: 'https://www.opendoors.org/en-US/countries/mozambique/',
  },
  'Namibia': { 
    peopleGroupCount: 29, christianPercentage: 90.8, unreachedPercentage: 2.1, mainReligion: 'Christianity',
    missionsText: 'Namibia is a largely Christian nation, but much of the faith is nominal Lutheranism. Missions focus on discipleship, youth work, and reaching remote peoples like the Himba and San (Bushmen).',
    christianChallenges: 'Nominalism is a major challenge. Many people are baptized but have no personal faith. Reaching nomadic and semi-nomadic groups requires specific cross-cultural skills.',
    prayerIdeas: 'Pray for revival in the mainstream churches. Pray for effective outreach to the Himba and San peoples. Pray for the church to address the issue of social inequality.',
    supportLink: 'https.www.abwe.org/work/fields/namibia',
  },
  'Niger': {
    peopleGroupCount: 38, christianPercentage: 0.3, unreachedPercentage: 95.8, mainReligion: 'Islam',
    missionsText: 'Niger is one of the least reached nations on earth. Missions focus on pioneer church planting among unreached peoples, humanitarian aid, and media outreach in a context of increasing insecurity.',
    christianChallenges: 'The church is tiny and faces immense pressure from a strongly Islamic society. Christians are often denied basic rights and opportunities. The threat of extremist violence is ever-present.',
    prayerIdeas: 'Pray for the small number of believers to stand firm in their faith. Pray for protection for missionaries and local pastors. Pray for creative and effective ways to share the Gospel.',
    supportLink: 'https://www.sim.org/where-we-work/niger',
  },
  'Nigeria': { 
    peopleGroupCount: 537, 
    christianPercentage: 46.3, 
    unreachedPercentage: 28.1,
    mainReligion: 'Islam/Christianity',
    missionsText: 'Nigeria is a spiritual giant, home to a massive, vibrant church and a powerful missions movement. Yet, it is also the site of some of the most intense Christian persecution in the world.',
    christianChallenges: 'Christians in the north live under the constant threat of brutal persecution. The country is divided along religious lines. Corruption and poor governance exacerbate the security crisis.',
    prayerIdeas: 'Pray for the persecuted church in the north. Pray for an end to the violence and for justice for victims. Pray for Nigerian missionaries being sent out across Africa and the world.',
    supportLink: 'https://www.opendoors.org/en-US/countries/nigeria/',
  },
  'Rwanda': { 
    peopleGroupCount: 13, christianPercentage: 93.6, unreachedPercentage: 5.4, mainReligion: 'Christianity',
    missionsText: 'The church in Rwanda is still grappling with the legacy of the 1994 genocide, in which many Christians participated. The focus of ministry is on deep reconciliation, trauma healing, and discipleship that leads to genuine transformation.',
    christianChallenges: 'The memory of the genocide and the church\'s failure is a major wound. The government can be suspicious of churches that it cannot control. There is a need for leaders who model forgiveness and ethnic unity.',
    prayerIdeas: 'Pray for deep and lasting healing and reconciliation. Pray for the church to be a true model of unity in Christ that transcends ethnicity. Pray for leaders of integrity and courage.',
    supportLink: 'https://www.worldvision.org/our-work/country/rwanda',
  },
  'São Tomé and Principe': { 
    peopleGroupCount: 10, christianPercentage: 80.0, unreachedPercentage: 1.0, mainReligion: 'Christianity',
    missionsText: 'This small island nation is predominantly Catholic. The evangelical church is small. The need is for leadership training and discipleship to counter a nominal, syncretistic faith.',
    christianChallenges: 'A folk Catholicism that mixes in traditional African beliefs is common. The evangelical church lacks trained leaders and resources.',
    prayerIdeas: 'Pray for the establishment of good theological training for pastors. Pray for the youth of the nation. Pray for the evangelical church to grow in depth and influence.',
    supportLink: 'https://prayercast.com/sao-tome-and-principe.html',
  },
  'Senegal': { 
    peopleGroupCount: 46, christianPercentage: 4.1, unreachedPercentage: 94.3, mainReligion: 'Islam',
    missionsText: 'Senegal is over 95% Muslim but is known for its religious tolerance. Missions work is possible but requires a relational, long-term approach. Ministries use community development, healthcare, and education as platforms for witness.',
    christianChallenges: 'The cultural identity is deeply intertwined with Islam, making conversion a difficult decision that can lead to family rejection. The church is small and needs more Senegalese leaders.',
    prayerIdeas: 'Pray that the climate of religious tolerance will continue. Pray for Senegalese believers to be bold in their witness to friends and family. Pray for a breakthrough among the majority Wolof people.',
    supportLink: 'https://www.sim.org/where-we-work/senegal',
  },
  'Seychelles': { 
    peopleGroupCount: 8, christianPercentage: 89.2, unreachedPercentage: 0.2, mainReligion: 'Christianity',
    missionsText: 'This prosperous island nation is mostly Catholic. The missions need is for discipleship and addressing social problems like substance abuse that lie beneath the tourist-paradise surface.',
    christianChallenges: 'Nominalism is common. The social problems of addiction reveal a spiritual vacuum that cultural Christianity is not filling.',
    prayerIdeas: 'Pray for revival in the churches. Pray for effective ministries to those struggling with addiction. Pray for believers to live out a vibrant faith that attracts others.',
    supportLink: 'https://prayercast.com/seychelles.html',
  },
  'Sierra Leone': { 
    peopleGroupCount: 23, christianPercentage: 20.9, unreachedPercentage: 35.6, mainReligion: 'Islam',
    missionsText: 'After a brutal civil war, Sierra Leone enjoys remarkable religious tolerance between Muslims and Christians. Missions focus on leadership training, community development, and church planting.',
    christianChallenges: 'Deep poverty and lack of infrastructure are major hindrances. The church needs more trained leaders. Syncretism with traditional beliefs is also a concern.',
    prayerIdeas: 'Pray for continued religious harmony. Pray for economic development and relief from poverty. Pray for the training and equipping of pastors.',
    supportLink: 'https://www.sim.org/where-we-work/sierra-leone',
  },
  'Somalia': {
    peopleGroupCount: 29, christianPercentage: 0.1, unreachedPercentage: 99.8, mainReligion: 'Islam',
    missionsText: 'Somalia is one of the most difficult and dangerous places to be a Christian. There is no overt mission work possible. The focus is on prayer and remote media outreach (radio, internet).',
    christianChallenges: 'The tiny number of believers (mostly from Muslim backgrounds) face constant danger of being discovered and killed by extremists or family members. The church is entirely underground and highly isolated.',
    prayerIdeas: 'Pray for the protection of every secret believer in Somalia. Pray that they would find fellowship with other Christians. Pray for the power of Gospel broadcasts to penetrate hearts.',
    supportLink: 'https://www.opendoors.org/en-US/countries/somalia/',
  },
  'Somaliland': { 
    peopleGroupCount: 10, christianPercentage: 0.01, unreachedPercentage: 99.9, mainReligion: 'Islam',
    missionsText: 'This self-declared independent state is deeply Islamic and hostile to the Gospel. Like Somalia, there is no open Christian presence. Any believers must live in complete secrecy.',
    christianChallenges: 'To be a Somali is to be a Muslim. Conversion is seen as a betrayal of one\'s family, clan, and identity, and can result in death.',
    prayerIdeas: 'Pray for the protection of any secret believers. Pray for Gospel media to reach into Somaliland. Pray for an opening for religious freedom.',
    supportLink: 'https://prayercast.com/somaliland.html',
  },
  'South Africa': { 
    peopleGroupCount: 158, christianPercentage: 81.2, unreachedPercentage: 5.4, mainReligion: 'Christianity',
    missionsText: 'South Africa has a vibrant church and a history of sending missionaries, but it also faces deep internal needs. Missions focus on racial reconciliation, addressing the legacy of Apartheid, urban ministry in townships, and combating the HIV/AIDS pandemic.',
    christianChallenges: 'The legacy of Apartheid still creates division within the church. Many are disillusioned with corruption. The prosperity gospel has a strong hold, and nominalism is common.',
    prayerIdeas: 'Pray for the church to be a genuine leader in racial reconciliation and justice. Pray for protection for those ministering in high-crime areas. Pray for a revival of biblical truth.',
    supportLink: 'https://www.abwe.org/work/fields/south-africa',
  },
  'S. Sudan': {
    peopleGroupCount: 85, christianPercentage: 60.5, unreachedPercentage: 27.2, mainReligion: 'Christianity',
    missionsText: 'The world\'s newest nation is home to a resilient church that has survived decades of war. Mission work focuses on trauma healing, leadership development, peace-building, and basic humanitarian aid.',
    christianChallenges: 'Widespread trauma from violence hinders spiritual and emotional health. Ethnic loyalties often supersede loyalty to Christ, causing division in the church. Illiteracy and lack of trained leaders are huge obstacles.',
    prayerIdeas: 'Pray for lasting peace and reconciliation between ethnic groups. Pray for the church to be a model of unity. Pray for resources to train pastors and provide trauma care.',
    supportLink: 'https://www.samaritanspurse.org/our-ministry/south-sudan-response/',
  },
  'Sudan': {
    peopleGroupCount: 147, christianPercentage: 5.4, unreachedPercentage: 77.0, mainReligion: 'Islam',
    missionsText: 'Following the secession of South Sudan, the church within Sudan is a small minority in a strongly Islamic state. Ministry is difficult and often clandestine, focused on strengthening existing churches and outreach in urban areas.',
    christianChallenges: 'Christians, particularly in conflict zones like the Nuba Mountains, face violent attacks. Church properties are often confiscated, and leaders are harassed. The ongoing war threatens the very existence of many communities.',
    prayerIdeas: 'Pray for an immediate end to the civil war. Pray for protection and provision for all Sudanese people, especially the Christian minority. Pray for the church to endure and be a light in the darkness.',
    supportLink: 'https://www.opendoors.org/en-US/countries/sudan/',
  },
  'Tanzania': { 
    peopleGroupCount: 161, christianPercentage: 63.1, unreachedPercentage: 17.5, mainReligion: 'Christianity',
    missionsText: 'Tanzania has a large Christian population and enjoys relative peace. Missions focus on leadership training, discipleship, and outreach to the remaining unreached people groups and the Muslim-majority coast and Zanzibar islands.',
    christianChallenges: 'The church needs more trained leaders to disciple its large population. Nominalism is common. The influence of radical Islam is a concern on the coast and islands.',
    prayerIdeas: 'Pray for solid theological training for pastors. Pray for continued peace between Christians and Muslims. Pray for a vibrant witness in Zanzibar.',
    supportLink: 'https://www.sim.org/where-we-work/tanzania',
  },
  'Togo': { 
    peopleGroupCount: 55, christianPercentage: 29.0, unreachedPercentage: 22.9, mainReligion: 'Christianity',
    missionsText: 'A large portion of the population follows traditional religions. The Christian church is growing but needs discipleship to counter the strong influence of animism and Voodoo.',
    christianChallenges: 'Syncretism is a major problem, with many Christians still participating in traditional rituals and fearing spiritual powers other than God.',
    prayerIdeas: 'Pray for Togolese believers to be completely set free from traditional spiritual bondage. Pray for the church to grow in depth and maturity. Pray for more Togolese to be trained as pastors.',
    supportLink: 'https.www.abwe.org/work/fields/togo',
  },
  'Tunisia': { 
    peopleGroupCount: 20, christianPercentage: 0.2, unreachedPercentage: 97.5, mainReligion: 'Islam',
    missionsText: 'The birthplace of the Arab Spring, Tunisia is the most secular of the North African nations, yet the church is tiny and under pressure. Ministry is done through personal relationships and online media.',
    christianChallenges: 'Despite a more secular society, leaving Islam is still seen as a betrayal. Believers are often isolated. There are very few public places of worship for them.',
    prayerIdeas: 'Pray for the small Tunisian church to be strengthened and to grow. Pray for courage for believers to share their faith wisely. Pray for online ministries to bear fruit.',
    supportLink: 'https://www.opendoors.org/en-US/countries/tunisia/',
  },
  'Uganda': { 
    peopleGroupCount: 80, christianPercentage: 84.8, unreachedPercentage: 4.8, mainReligion: 'Christianity',
    missionsText: 'Uganda has a large and vibrant church, born out of the testimony of martyrs. The church is active in missions. The focus is on leadership development, discipleship, and addressing social issues like poverty and corruption.',
    christianChallenges: 'Nominalism and prosperity teaching are significant issues. The legacy of war has left deep trauma in the north. Corruption is a major societal problem that tests the integrity of believers.',
    prayerIdeas: 'Pray for revival to bring depth to the church. Pray for healing from the trauma of past wars. Pray for Christians in leadership to be models of integrity.',
    supportLink: 'https.aimint.org/african-countries/uganda/',
  },
  'W. Sahara': { 
    peopleGroupCount: 7, christianPercentage: 0.2, unreachedPercentage: 99.8, mainReligion: 'Islam',
    missionsText: 'This disputed territory is almost entirely Muslim. The Sahrawi people are unreached. There is no known indigenous church. Any Christian presence is among the Moroccan military or UN personnel.',
    christianChallenges: 'There is no freedom to share the Gospel. The Sahrawi identity is completely intertwined with Islam. The political situation is a major barrier.',
    prayerIdeas: 'Pray for a just and peaceful resolution to the political conflict. Pray for the Sahrawi people in refugee camps to encounter the Gospel. Pray for the first believers to emerge among this people group.',
    supportLink: 'https://prayercast.com/western-sahara.html',
  },
  'Zambia': { 
    peopleGroupCount: 80, christianPercentage: 95.5, unreachedPercentage: 10.4, mainReligion: 'Christianity',
    missionsText: 'Zambia is officially a "Christian nation." The church is wide but not always deep. Missions focus on theological education, discipleship, and reaching less-reached groups.',
    christianChallenges: 'Nominalism is a major challenge. Syncretism with traditional beliefs and the influence of prosperity gospels are also concerns. There is a great need for well-trained pastors.',
    prayerIdeas: 'Pray for the nation\'s identity as a "Christian nation" to be reflected in true righteousness and justice. Pray for a movement of discipleship. Pray for the youth of Zambia.',
    supportLink: 'https://www.sim.org/where-we-work/zambia',
  },
  'Zimbabwe': { 
    peopleGroupCount: 32, christianPercentage: 86.0, unreachedPercentage: 9.3, mainReligion: 'Christianity',
    missionsText: 'The church in Zimbabwe has shown great resilience through decades of political and economic crisis. Missions focus on leadership development, compassionate ministries, and providing hope in a difficult context.',
    christianChallenges: 'The overwhelming challenge is survival in a collapsed economy. The church is a key source of aid and hope, but pastors themselves are struggling. Many have emigrated.',
    prayerIdeas: 'Pray for a political and economic turnaround. Pray for provision and strength for pastors and their families. Pray for the church to remain a faithful witness and source of hope.',
    supportLink: 'https://www.abwe.org/work/fields/zimbabwe',
  },

  // Asia
  'Afghanistan': {
    peopleGroupCount: 88, christianPercentage: 0.1, unreachedPercentage: 99.8, mainReligion: 'Islam',
    missionsText: 'Following the Taliban takeover, all overt Christian work has ceased. The focus is entirely on prayer and remote digital and media outreach to the small, hidden, and highly persecuted community of believers.',
    christianChallenges: 'Extreme persecution. It is arguably the most dangerous country in the world to be a Christian. Believers must keep their faith completely secret from family, friends, and authorities.',
    prayerIdeas: 'Pray for the miraculous protection of every believer in Afghanistan. Pray they would be able to find and connect with each other. Pray for hope to penetrate the nation through dreams, visions, and media.',
    supportLink: 'https://www.opendoors.org/en-US/countries/afghanistan/',
  },
  'Armenia': { 
    peopleGroupCount: 17, christianPercentage: 92.5, unreachedPercentage: 2.1, mainReligion: 'Christianity',
    missionsText: 'As the world\'s first Christian nation, Armenia has a deep Christian identity tied to the Armenian Apostolic Church. Evangelical missions focus on renewal, discipleship, and social outreach in partnership with local churches.',
    christianChallenges: 'The traditional church can be resistant to evangelicals, who are sometimes seen as "sects." The trauma of the conflict and historical genocide weighs heavily on the national psyche.',
    prayerIdeas: 'Pray for healing and peace for the Armenian people. Pray for unity and cooperation between traditional and evangelical churches. Pray for the church to be a source of true hope.',
    supportLink: 'https://www.fellowshipinternational.ca/FIMissions/Armenia',
  },
  'Azerbaijan': {
    peopleGroupCount: 32, christianPercentage: 2.5, unreachedPercentage: 95.9, mainReligion: 'Islam',
    missionsText: 'Ministry in Azerbaijan is challenging due to government restrictions. Evangelism is limited, and churches face difficulty with registration. Ministry often happens through personal relationships and small, unregistered house gatherings.',
    christianChallenges: 'Christians, especially non-Orthodox believers, are viewed with suspicion by the government. Converts from Islam face pressure from their families and communities. There is a need for more trained local leaders.',
    prayerIdeas: 'Pray for greater religious freedom. Pray for courage and wisdom for local pastors and believers. Pray for the growth of the small but faithful evangelical community.',
    supportLink: 'https://www.persecution.com/azerbaijan/',
  },
  'Bahrain': { 
    peopleGroupCount: 25, christianPercentage: 14.5, unreachedPercentage: 55.4, mainReligion: 'Islam',
    missionsText: 'Bahrain is relatively tolerant compared to its neighbors, with freedom of worship for expatriates. The Christian population is almost entirely foreign workers. Ministry to Bahraini Arabs is highly restricted.',
    christianChallenges: 'Evangelizing Muslims is not permitted. The conversion of a Bahraini citizen would lead to severe legal and social consequences. The church is a transient, expatriate community.',
    prayerIdeas: 'Pray for the expatriate churches to be a vibrant witness through their lives. Pray for creative and wise ways to share the Gospel with the local population. Pray for any secret Bahraini believers.',
    supportLink: 'https://prayercast.com/bahrain.html',
  },
  'Bangladesh': {
    peopleGroupCount: 377, christianPercentage: 0.3, unreachedPercentage: 88.3, mainReligion: 'Islam',
    missionsText: 'Bangladesh is home to a growing church, especially among tribal groups and lower castes. Mission work focuses on church planting, leadership development, and social ministries like education and healthcare.',
    christianChallenges: 'Persecution of converts is severe, often involving being disowned by family, loss of livelihood, and physical attacks. The church is under-resourced and needs more trained leaders to disciple the many new believers.',
    prayerIdeas: 'Pray for the protection and provision for new believers, especially those from Muslim backgrounds. Pray for the training of pastors and church planters. Pray against the rise of religious extremism.',
    supportLink: 'https://www.opendoors.org/en-US/countries/bangladesh/',
  },
  'Bhutan': { 
    peopleGroupCount: 36, christianPercentage: 1.9, unreachedPercentage: 84.7, mainReligion: 'Buddhism',
    missionsText: 'This Himalayan kingdom seeks to preserve its traditional Buddhist culture. Proselytism is forbidden, and the small Christian community faces significant pressure and monitoring.',
    christianChallenges: 'Christians are seen as a threat to national culture and identity. Believers worship in house churches and face discrimination in education and employment. It is difficult to get a Christian burial.',
    prayerIdeas: 'Pray for the believers to stand firm in their faith despite the pressures. Pray for wisdom for house church leaders. Pray for a change in government policy to allow for religious freedom.',
    supportLink: 'https://www.opendoors.org/en-US/countries/bhutan/',
  },
  'Brunei': { 
    peopleGroupCount: 24, christianPercentage: 11.2, unreachedPercentage: 35.8, mainReligion: 'Islam',
    missionsText: 'Brunei is a wealthy sultanate that enforces a strict form of Sharia law. Evangelizing Muslims is strictly forbidden. Christians have freedom of worship but cannot share their faith publicly.',
    christianChallenges: 'Severe restrictions on religious freedom. Converts from Islam face intense pressure and are forced to undergo counseling to return to Islam. The church is monitored.',
    prayerIdeas: 'Pray for perseverance for the Christians in Brunei. Pray for wisdom for them to live out their faith within the strict limitations. Pray for any secret believers from a Muslim background.',
    supportLink: 'https://www.opendoors.org/en-US/countries/brunei/',
  },
  'Cambodia': {
    peopleGroupCount: 47, christianPercentage: 1.5, unreachedPercentage: 66.8, mainReligion: 'Buddhism',
    missionsText: 'The Cambodian church has seen incredible growth since the Khmer Rouge regime. The focus is now on discipleship, developing healthy church leadership, and reaching the next generation.',
    christianChallenges: 'A lack of mature, trained leaders has led to the spread of syncretism and false teachings. Deep-seated Buddhist traditions and ancestor worship are major cultural barriers to the Gospel.',
    prayerIdeas: 'Pray for the establishment of strong Bible schools and seminaries. Pray for the raising up of godly Cambodian church leaders. Pray for healing from the nation\'s traumatic history.',
    supportLink: 'https://omf.org/asia/cambodia/',
  },
  'China': {
    peopleGroupCount: 559,
    christianPercentage: 5.1,
    unreachedPercentage: 84.0,
    mainReligion: 'Folk Religion/Unaffiliated',
    missionsText: 'Despite restrictions, China is home to one of the largest and fastest-growing churches in the world, primarily within the house church movement. The focus is on discipleship, leadership training, and navigating government oversight.',
    christianChallenges: 'Believers face intense government scrutiny, surveillance, and restrictions on worship. The official Three-Self Patriotic Movement church is heavily controlled, while house churches risk raids and persecution.',
    prayerIdeas: 'Pray for the perseverance and courage of house church leaders. Pray for Bibles to be accessible to all believers. Pray for wisdom for Christians to live out their faith under pressure.',
    supportLink: 'https://www.opendoors.org/en-US/countries/china/',
  },
  'Georgia': { 
    peopleGroupCount: 32, christianPercentage: 87.8, unreachedPercentage: 6.9, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Georgia has an ancient Christian heritage and a strong national identity tied to the Orthodox Church. Evangelical Christians are a small minority and are often viewed with suspicion.',
    christianChallenges: 'Evangelicals are often ostracized and labeled as "sectarians." The cultural dominance of the Orthodox Church makes it difficult for people to consider a personal, evangelical faith.',
    prayerIdeas: 'Pray for unity and favor for the small evangelical church. Pray for opportunities to show that a personal faith in Christ is not a betrayal of their national identity.',
    supportLink: 'https://www.imb.org/europe/georgia/',
  },
  'India': {
    peopleGroupCount: 2252, christianPercentage: 2.3, unreachedPercentage: 90.1, mainReligion: 'Hinduism',
    missionsText: 'India has a vast number of unreached people groups. Mission work is increasingly carried out by Indian nationals, focusing on church planting in the north (the "Ganges Belt") and among tribal populations.',
    christianChallenges: 'Violent persecution, including mob attacks on churches and believers, is common in many states. Christians are often falsely accused of forced conversions. The caste system remains a significant social barrier.',
    prayerIdeas: 'Pray for the protection of pastors and evangelists. Pray for the repeal of unjust anti-conversion laws. Pray for the Dalit ("untouchable") and tribal peoples to find freedom and dignity in Christ.',
    supportLink: 'https://www.opendoors.org/en-US/countries/india/',
  },
  'Indonesia': {
    peopleGroupCount: 742, christianPercentage: 10.7, unreachedPercentage: 42.4, mainReligion: 'Islam',
    missionsText: 'As the world\'s most populous Muslim nation, Indonesia is a critical mission field. The Indonesian church is large and diverse, with a growing vision to send missionaries to other unreached parts of the country and Asia.',
    christianChallenges: 'Christians face discrimination and legal obstacles, particularly in conservative regions like Aceh. Blasphemy laws are sometimes used against Christians. Reaching the many unreached people groups on remote islands is a huge logistical challenge.',
    prayerIdeas: 'Pray for the protection of churches and for religious freedom to be upheld. Pray for the Indonesian church\'s missionary vision to flourish. Pray for believers to be bold yet wise witnesses.',
    supportLink: 'https://www.persecution.com/indonesia/',
  },
  'Iran': {
    peopleGroupCount: 91, christianPercentage: 0.5, unreachedPercentage: 97.4, mainReligion: 'Islam',
    missionsText: 'Iran has one of the fastest-growing underground church movements in the world. All ministry is clandestine, relying on satellite TV, internet, and secret house church networks for evangelism and discipleship.',
    christianChallenges: 'Extreme government persecution. Believers cannot own Bibles openly or worship publicly. They live with the constant risk of arrest, imprisonment, and torture. Isolation is a major struggle.',
    prayerIdeas: 'Pray for the protection and courage of house church leaders and members. Pray for the effectiveness of satellite and internet ministries. Pray that imprisoned Christians would be sustained by God and released.',
    supportLink: 'https://www.elam.com/iran',
  },
  'Iraq': {
    peopleGroupCount: 41, christianPercentage: 0.7, unreachedPercentage: 86.6, mainReligion: 'Islam',
    missionsText: 'Iraq\'s ancient Christian community has been decimated by decades of war and persecution, especially by ISIS. Ministry focuses on providing humanitarian aid, trauma care, and helping to rebuild shattered communities.',
    christianChallenges: 'The Christian population has shrunk dramatically due to emigration. Believers live with deep trauma and uncertainty about their future. Converts from Islam face extreme danger from family and society.',
    prayerIdeas: 'Pray for the remaining Christians to have the strength and resources to stay and rebuild. Pray for healing from the deep trauma of war and genocide. Pray for a future of peace and security in Iraq.',
    supportLink: 'https://www.opendoors.org/en-US/countries/iraq/',
  },
  'Israel': { 
    peopleGroupCount: 54, christianPercentage: 2.0, unreachedPercentage: 66.8, mainReligion: 'Judaism',
    missionsText: 'Ministry in Israel happens in the complex context of the Israeli-Palestinian conflict. It includes ministry to Messianic Jews, Arab Israeli Christians, and Palestinians. The focus is on evangelism, discipleship, and reconciliation.',
    christianChallenges: 'For Jews, believing in Jesus is often seen as a betrayal of their people. For Palestinians, the pressures of the conflict are immense. Building unity between Jewish and Arab believers is a beautiful but difficult calling.',
    prayerIdeas: 'Pray for peace in the land. Pray for the growth and protection of the Messianic and Palestinian churches. Pray for believers to be powerful agents of reconciliation.',
    supportLink: 'https://www.oneforisrael.org/',
  },
  'Japan': {
    peopleGroupCount: 126, christianPercentage: 1.5, unreachedPercentage: 95.8, mainReligion: 'Shintoism/Buddhism',
    missionsText: 'Japan remains one of the largest unreached people groups in the world. The church is small. Missions require long-term commitment, focusing on relationship-building and finding creative ways to connect with a spiritually-reserved and work-oriented culture.',
    christianChallenges: 'Strong cultural pressures to conform and maintain group harmony make it difficult for individuals to make a personal decision for Christ. Materialism and secularism are also major barriers.',
    prayerIdeas: 'Pray for a spiritual breakthrough in Japan. Pray for creative and effective strategies for evangelism. Pray for the encouragement and strengthening of Japanese pastors and churches.',
    supportLink: 'https://omf.org/asia/japan/',
  },
  'Jordan': { 
    peopleGroupCount: 27, christianPercentage: 2.1, unreachedPercentage: 70.3, mainReligion: 'Islam',
    missionsText: 'Jordan has an established Christian minority and is a key refuge for Christians fleeing conflicts in Iraq and Syria. Ministries focus on serving these refugee populations and carefully building relationships with Jordanians.',
    christianChallenges: 'While recognized churches have freedom, evangelizing Muslims is not welcome. Jordanian converts from Islam face severe family and social persecution. The church is burdened with caring for vast numbers of traumatized refugees.',
    prayerIdeas: 'Pray for wisdom and resources for the Jordanian church as it ministers to refugees. Pray for protection and fellowship for Jordanian believers from a Muslim background. Pray for continued stability for the nation.',
    supportLink: 'https://www.persecution.com/jordan/',
  },
  'Kazakhstan': { 
    peopleGroupCount: 97, christianPercentage: 22.8, unreachedPercentage: 61.8, mainReligion: 'Islam',
    missionsText: 'The government restricts religious freedom, requiring all religious groups to register. Ministry, especially outside the officially recognized Orthodox Church, faces scrutiny. Outreach is often done through personal relationships and social projects.',
    christianChallenges: 'Christians from a Muslim background (ethnic Kazakhs) face the most pressure from family and community. Government restrictions make church planting and evangelism difficult.',
    prayerIdeas: 'Pray for greater religious freedom. Pray for courage and perseverance for Kazakh believers. Pray for the registration of more evangelical churches.',
    supportLink: 'https://www.opendoors.org/en-US/countries/kazakhstan/',
  },
  'Kuwait': { 
    peopleGroupCount: 36, christianPercentage: 17.6, unreachedPercentage: 69.1, mainReligion: 'Islam',
    missionsText: 'The large Christian population is comprised entirely of expatriate workers, who can worship freely in designated compounds. Any ministry to Kuwaiti Arabs is strictly forbidden and extremely dangerous.',
    christianChallenges: 'The church is a segregated, foreign community with no ability to interact with locals on a spiritual level. Any Kuwaiti who shows interest in Christianity puts themselves in great danger.',
    prayerIdeas: 'Pray for the witness of the expatriate Christians in their workplaces. Pray for media and online ministries to reach Kuwaitis. Pray for the protection of any secret believers.',
    supportLink: 'https://prayercast.com/kuwait.html',
  },
  'Kyrgyzstan': { 
    peopleGroupCount: 50, christianPercentage: 7.2, unreachedPercentage: 79.4, mainReligion: 'Islam',
    missionsText: 'The church in Kyrgyzstan has grown since independence from the USSR but faces increasing pressure from a revival of Islam and government restrictions.',
    christianChallenges: 'Kyrgyz believers from a Muslim background are often ostracized by their families and communities. The government is increasingly suspicious of evangelical churches.',
    prayerIdeas: 'Pray for the church to stand firm in the face of new restrictions. Pray for protection for Kyrgyz converts. Pray for unity and courage among pastors.',
    supportLink: 'https://www.opendoors.org/en-US/countries/kyrgyzstan/',
  },
  'Laos': {
    peopleGroupCount: 147, christianPercentage: 2.0, unreachedPercentage: 64.9, mainReligion: 'Buddhism',
    missionsText: 'The church in Laos has grown significantly, especially among tribal minorities, despite facing government opposition. Ministry is often restricted and requires wisdom and discretion.',
    christianChallenges: 'Christians face pressure and persecution from local authorities who see Christianity as a foreign influence that undermines traditional culture and political control.',
    prayerIdeas: 'Pray for religious freedom in Laos. Pray for protection and wisdom for church leaders. Pray for the continued growth of the church, especially among the majority Lao people.',
    supportLink: 'https://www.persecution.com/laos/',
  },
  'Lebanon': { 
    peopleGroupCount: 40, christianPercentage: 32.4, unreachedPercentage: 54.4, mainReligion: 'Islam/Christianity',
    missionsText: 'Lebanon is the only Arab country with a Christian head of state and has the largest percentage of Christians in the Middle East. It is a center for Christian media and theological education for the Arab world. The church is also heavily involved in refugee ministry.',
    christianChallenges: 'The Christian population has been shrinking due to emigration caused by war and economic collapse. The church is politically fragmented. The sheer scale of the national crisis is overwhelming.',
    prayerIdeas: 'Pray for an economic and political miracle for Lebanon. Pray for the church to be unified and to be a source of hope and salt in a broken society. Pray for strength for believers to persevere and not emigrate.',
    supportLink: 'https.www.abwe.org/work/fields/lebanon',
  },
  'Malaysia': {
    peopleGroupCount: 140, christianPercentage: 9.2, unreachedPercentage: 60.1, mainReligion: 'Islam',
    missionsText: 'Ministry in Malaysia is complex. While Christians from Chinese and Indian backgrounds have relative freedom, it is illegal to evangelize ethnic Malays. Ministry to Muslims is highly restricted and dangerous.',
    christianChallenges: 'The inability to legally share the Gospel with the majority Malay population is the greatest challenge. Christians face legal and social discrimination. Unity among diverse Christian denominations can be a struggle.',
    prayerIdeas: 'Pray for the protection of those who minister to Muslims. Pray for a change in the laws that restrict evangelism. Pray for the Malaysian church to be a bold and unified witness.',
    supportLink: 'https://www.opendoors.org/en-US/countries/malaysia/',
  },
  'Maldives': { 
    peopleGroupCount: 3, christianPercentage: 0.4, unreachedPercentage: 99.5, mainReligion: 'Islam',
    missionsText: 'This luxury tourist destination is a strict Islamic state. All citizens must be Muslim. There are no churches. Any Maldivian Christian must live in absolute secrecy.',
    christianChallenges: 'Extreme persecution. There is no religious freedom. A Maldivian who converts to Christianity would face loss of citizenship and potentially death.',
    prayerIdeas: 'Pray for the Maldivian people to have opportunities to hear the Gospel, perhaps while working or studying abroad. Pray for any secret believers to be protected and sustained. Pray for Gospel media to reach the islands.',
    supportLink: 'https://www.opendoors.org/en-US/countries/maldives/',
  },
  'Mongolia': { 
    peopleGroupCount: 27, christianPercentage: 1.3, unreachedPercentage: 81.3, mainReligion: 'Buddhism',
    missionsText: 'The church in Mongolia has grown from a handful of believers in 1990 to tens of thousands today. This young, first-generation church is now focusing on discipleship, leadership training, and sending out its own missionaries.',
    christianChallenges: 'The rapid growth has created a great need for trained pastors and leaders. The harsh climate and vast distances make ministry difficult. Nominalism is becoming a challenge as the church matures.',
    prayerIdeas: 'Pray for the establishment of strong theological training for a new generation of Mongolian leaders. Pray for the Mongolian church to become a great missionary-sending force in Asia.',
    supportLink: 'https://www.pioneers.org/us/give/projects/mongolia-country-campaign',
  },
  'Myanmar': {
    peopleGroupCount: 147, christianPercentage: 7.9, unreachedPercentage: 66.8, mainReligion: 'Buddhism',
    missionsText: 'The church is strongest among ethnic minorities like the Karen and Kachin. Decades of civil war have deeply affected these Christian communities. There is a great need for Bible translation and ministry among the majority Bamar people.',
    christianChallenges: 'Extreme persecution, especially in ethnic minority states where Christians are targeted by the military. The church is caught in a devastating conflict. Reaching the Buddhist Bamar majority remains a challenge.',
    prayerIdeas: 'Pray for an end to the civil war and the violence of the military junta. Pray for the protection and survival of Christian communities under attack. Pray for believers to find strength in Christ amidst incredible suffering.',
    supportLink: 'https://www.opendoors.org/en-US/countries/myanmar/',
  },
  'Nepal': {
    peopleGroupCount: 395, christianPercentage: 1.4, unreachedPercentage: 87.8, mainReligion: 'Hinduism',
    missionsText: 'The Nepali church is one of the fastest-growing in the world. After centuries as a closed Hindu kingdom, the church has exploded in size. The focus is on training leaders to shepherd this massive harvest.',
    christianChallenges: 'The rapid growth has led to a critical shortage of trained pastors and an influx of false teaching. Persecution from Hindu extremists and the misuse of anti-conversion laws are increasing.',
    prayerIdeas: 'Pray for the provision of solid, accessible theological training for Nepali pastors. Pray for believers to be grounded in the Word. Pray for justice and the repeal of anti-conversion laws.',
    supportLink: 'https://www.persecution.com/nepal/',
  },
  'North Korea': {
    peopleGroupCount: 1, christianPercentage: 1.7, unreachedPercentage: 98.3, mainReligion: 'Juche/Irreligion',
    missionsText: 'North Korea is the most closed country on earth and consistently ranked as the most severe persecutor of Christians. All ministry is done in absolute secrecy. Radio broadcasts from outside the country are a key lifeline.',
    christianChallenges: 'The most extreme persecution imaginable. Believers cannot even tell their own children about their faith for fear of being reported. Owning a Bible is a capital offense.',
    prayerIdeas: 'Pray for the protection and survival of the secret church. Pray for those suffering in prison camps. Pray for the effectiveness of Gospel radio broadcasts. Pray for the fall of the Kim regime and for freedom to come to North Korea.',
    supportLink: 'https://www.opendoors.org/en-US/countries/north-korea/',
  },
  'Oman': { 
    peopleGroupCount: 46, christianPercentage: 6.5, unreachedPercentage: 66.8, mainReligion: 'Islam',
    missionsText: 'Oman allows freedom of worship for its large expatriate Christian population in designated church compounds. However, evangelizing Muslims is forbidden, and conversion from Islam is not legally recognized.',
    christianChallenges: 'Omani believers from a Muslim background face severe pressure from family and society, though perhaps less than in neighboring countries. They cannot worship openly. The expatriate church has little contact with Omani society.',
    prayerIdeas: 'Pray for protection and fellowship for Omani believers. Pray for expatriate Christians to find opportunities for discreet witness. Pray for greater religious freedom in the nation.',
    supportLink: 'https://prayercast.com/oman.html',
  },
  'Pakistan': {
    peopleGroupCount: 447, christianPercentage: 2.1, unreachedPercentage: 92.2, mainReligion: 'Islam',
    missionsText: 'The church in Pakistan is a resilient minority in a fiercely Islamic context. Ministry includes pastoral care, education for poor Christian communities, and advocacy for those falsely accused under blasphemy laws.',
    christianChallenges: 'Extreme social and legal discrimination. The constant threat of blasphemy accusations and mob violence. Abduction and forced conversion/marriage of Christian girls is a major problem.',
    prayerIdeas: 'Pray for the repeal of the blasphemy laws. Pray for protection for Christian communities from mob attacks. Pray for economic and educational opportunities for believers.',
    supportLink: 'https://www.opendoors.org/en-US/countries/pakistan/',
  },
  'Palestine': { 
    peopleGroupCount: 2, christianPercentage: 1.1, unreachedPercentage: 70.1, mainReligion: 'Islam',
    missionsText: 'The ancient Christian community in the West Bank and Gaza is shrinking rapidly due to emigration. Ministry focuses on strengthening the remaining church, providing education and social services, and being a witness for peace.',
    christianChallenges: 'The political conflict and lack of economic opportunity are driving Christians to leave the Holy Land. The church is in danger of disappearing from its birthplace. Believers from a Muslim background face intense persecution.',
    prayerIdeas: 'Pray for the Palestinian church to have the strength and hope to remain. Pray for them to be peacemakers. Pray for protection for converts from Islam.',
    supportLink: 'https://bethlehembiblecollege.edu/',
  },
  'Philippines': { 
    peopleGroupCount: 187, christianPercentage: 92.0, unreachedPercentage: 11.2, mainReligion: 'Christianity',
    missionsText: 'The only Christian-majority nation in Asia, the Philippines has a vibrant church and a strong missions vision. The focus is on discipleship to counter folk Catholicism, church planting among numerous unreached tribal groups, and outreach to the Muslim minority.',
    christianChallenges: 'Syncretism between Catholicism and traditional/animistic beliefs is widespread. The church in Mindanao faces threats and persecution from extremist groups. The prosperity gospel is also influential.',
    prayerIdeas: 'Pray for Filipino missionaries being sent across Asia and the world. Pray for peace and protection for churches in Mindanao. Pray for a discipleship movement that brings true transformation.',
    supportLink: 'https://www.pmi.org.ph/',
  },
  'Qatar': { 
    peopleGroupCount: 28, christianPercentage: 13.8, unreachedPercentage: 73.1, mainReligion: 'Islam',
    missionsText: 'Like other Gulf states, the large Christian population in Qatar consists of foreign workers who have freedom to worship in a designated religious complex. Ministry to Qataris is forbidden.',
    christianChallenges: 'There is no religious freedom for Qatari citizens. Conversion from Islam is illegal and would result in severe consequences. The church is an isolated expatriate bubble.',
    prayerIdeas: 'Pray that the thousands of expatriate believers would live lives of integrity and witness. Pray for Qataris to encounter Christ through media or while traveling. Pray for any secret believers.',
    supportLink: 'https://www.opendoors.org/en-US/countries/qatar/',
  },
  'Saudi Arabia': {
    peopleGroupCount: 58, christianPercentage: 4.4, unreachedPercentage: 86.6, mainReligion: 'Islam',
    missionsText: 'As the heartland of Islam, all religions other than Islam are suppressed. There are no public churches. Christian fellowship happens in secret among expatriate workers and a tiny number of Saudi believers.',
    christianChallenges: 'It is illegal for Saudi citizens to be Christian. Converts face persecution from the state and their families. Expatriate Christians can worship privately but are forbidden from evangelizing Saudis.',
    prayerIdeas: 'Pray for the protection of the few Saudi believers. Pray for opportunities for expatriate Christians to be a quiet witness. Pray for the hearts of the Saudi people to be opened to the Gospel.',
    supportLink: 'https://prayercast.com/saudi-arabia.html',
  },
  'Siachen Glacier': { 
    peopleGroupCount: 0, christianPercentage: null, unreachedPercentage: null, mainReligion: 'N/A',
    missionsText: 'The Siachen Glacier is the world\'s highest battlefield, a disputed territory between India and Pakistan. It is not permanently inhabited by civilians.',
    christianChallenges: 'The challenges are environmental and military, not religious persecution in the traditional sense.',
    prayerIdeas: 'Pray for peace between India and Pakistan. Pray for the safety of the soldiers stationed in this incredibly harsh environment.',
    supportLink: null,
  },
  'Singapore': { 
    peopleGroupCount: 77, christianPercentage: 18.9, unreachedPercentage: 35.7, mainReligion: 'Buddhism',
    missionsText: 'Singapore is a multicultural, multi-religious nation with a vibrant and well-resourced church. It serves as a major hub for missions into the rest of Asia. The focus is on discipleship, marketplace ministry, and cross-cultural missions sending.',
    christianChallenges: 'Materialism and secularism are major influences in this prosperous nation. Young people are increasingly irreligious. Maintaining missional zeal in a comfortable environment is a challenge.',
    prayerIdeas: 'Pray for the Singaporean church to continue to be a strategic missions base for Asia. Pray for believers to effectively engage a materialistic and secular culture. Pray for revival among the youth.',
    supportLink: 'https://www.missionshub.sg/',
  },
  'South Korea': { 
    peopleGroupCount: 19, christianPercentage: 27.6, unreachedPercentage: 40.8, mainReligion: 'Irreligion/Christianity',
    missionsText: 'South Korea is a global missions powerhouse, second only to the USA in the number of missionaries sent. The Korean church is known for its prayerfulness and passion. The focus now is on reaching the younger, more secular generation at home.',
    christianChallenges: 'Nominalism and materialism have crept into this once-revival-fueled church. The intense pressure of the education and work culture is a major idol. Reconnecting with a skeptical younger generation is critical.',
    prayerIdeas: 'Pray for a new wave of revival and repentance in the Korean church. Pray for Korean missionaries around the world. Pray for wisdom for the church to effectively reach the next generation.',
    supportLink: 'https://www.kwma.org/',
  },
  'Sri Lanka': {
    peopleGroupCount: 71, christianPercentage: 7.6, unreachedPercentage: 46.5, mainReligion: 'Buddhism',
    missionsText: 'The church in Sri Lanka is a minority facing pressure from Buddhist nationalism. Ministry involves strengthening local churches, reconciliation work following the long civil war, and outreach.',
    christianChallenges: 'Christians face harassment and violence from Buddhist extremist groups. Church services are disrupted, and believers are pressured to recant their faith. The legacy of ethnic conflict still affects church unity.',
    prayerIdeas: 'Pray for protection for churches and pastors from nationalist attacks. Pray for believers to have courage. Pray for the church to be an agent of reconciliation between Sinhalese and Tamil communities.',
    supportLink: 'https://www.persecution.com/srilanka/',
  },
  'Syria': {
    peopleGroupCount: 23, christianPercentage: 3.5, unreachedPercentage: 86.8, mainReligion: 'Islam',
    missionsText: 'The decade-long civil war has shattered Syria and its ancient Christian communities. Mission and church work is now almost entirely humanitarian relief: providing food, shelter, and trauma care to a devastated population.',
    christianChallenges: 'The Christian population has plummeted due to war and emigration. In some areas, extremist groups still pose a threat. The overwhelming challenge is simply survival amidst poverty and destruction.',
    prayerIdeas: 'Pray for peace and stability for Syria. Pray for provision for the church to continue its vital relief work. Pray for strength and hope for Syrian believers to remain a light in their broken land.',
    supportLink: 'https://www.worldvision.org/disaster-relief-news-stories/syria-conflict-facts',
  },
  'Taiwan': { 
    peopleGroupCount: 38, christianPercentage: 4.5, unreachedPercentage: 54.4, mainReligion: 'Folk Religion/Buddhism',
    missionsText: 'Taiwan enjoys complete religious freedom. The church is growing, particularly among the educated and urban classes. The focus is on discipleship, church planting, and outreach to the majority who follow traditional Chinese folk religions.',
    christianChallenges: 'The spiritual strongholds of traditional religion, ancestor worship, and materialism are the main barriers to the Gospel. The church needs more pastors trained for urban ministry.',
    prayerIdeas: 'Pray for peace and protection for Taiwan. Pray for the church to have a powerful witness in the face of idolatry and materialism. Pray for a breakthrough among the working class and rural communities.',
    supportLink: 'https://omf.org/asia/taiwan/',
  },
  'Tajikistan': { 
    peopleGroupCount: 43, christianPercentage: 1.6, unreachedPercentage: 97.5, mainReligion: 'Islam',
    missionsText: 'This authoritarian state in Central Asia heavily restricts all religious activity. The small church, mostly composed of believers from a Muslim background, faces constant government scrutiny and social pressure.',
    christianChallenges: 'Severe government restrictions make church life very difficult. Believers from a Muslim background are persecuted by their families and communities. The church is isolated and lacks resources.',
    prayerIdeas: 'Pray for the government to ease its restrictions on religion. Pray for the protection and encouragement of Tajik believers. Pray for access to Bibles and Christian teaching.',
    supportLink: 'https://www.opendoors.org/en-US/countries/tajikistan/',
  },
  'Thailand': { 
    peopleGroupCount: 125, christianPercentage: 1.1, unreachedPercentage: 83.1, mainReligion: 'Buddhism',
    missionsText: 'Thai identity is deeply connected to Buddhism and the monarchy, making it one of the least-reached Buddhist nations. Missions require a long-term, relational approach. The church is stronger among tribal groups than among the ethnic Thai.',
    christianChallenges: 'The cultural stronghold of Buddhism is immense. To become Christian is often seen as rejecting one\'s Thai identity. The church lacks enough Thai leaders to reach their own people.',
    prayerIdeas: 'Pray for a spiritual breakthrough among the Thai Buddhist population. Pray for the raising up of Thai evangelists and church planters. Pray for the many ministries based in Thailand reaching into restricted-access nations.',
    supportLink: 'https://omf.org/asia/thailand/',
  },
  'Timor-Leste': { 
    peopleGroupCount: 35, christianPercentage: 97.6, unreachedPercentage: 1.8, mainReligion: 'Christianity',
    missionsText: 'One of Asia\'s only two Catholic-majority nations, Timor-Leste is still rebuilding after its long struggle for independence. The focus of missions is on leadership development, discipleship to counter syncretism, and community development.',
    christianChallenges: 'Faith is often a mix of Catholicism and traditional animistic beliefs. There is a great need for sound biblical teaching and for the Bible to be translated into local languages.',
    prayerIdeas: 'Pray for the political and economic development of the nation. Pray for Bible translation efforts. Pray for Timorese church leaders to be well-equipped to disciple their people.',
    supportLink: 'https://www.worldvision.org/our-work/country/timor-leste',
  },
  'Turkey': {
    peopleGroupCount: 75, christianPercentage: 0.2, unreachedPercentage: 98.6, mainReligion: 'Islam',
    missionsText: 'Turkey has a rich Christian history but a tiny contemporary church. Ministry is difficult in a climate of strong nationalism and suspicion of Christianity. Work focuses on supporting the small Turkish church and media outreach.',
    christianChallenges: 'Being a Turkish Christian means being seen as a traitor to the nation. Believers face intense social and family pressure. Evangelism is seen as an attack on Turkish identity.',
    prayerIdeas: 'Pray for the tiny Turkish church to be courageous and resilient. Pray for protection for believers from social hostility. Pray for creative avenues for the Gospel to spread.',
    supportLink: 'https://prayercast.com/turkey.html',
  },
  'Turkmenistan': { 
    peopleGroupCount: 42, christianPercentage: 1.2, unreachedPercentage: 97.9, mainReligion: 'Islam',
    missionsText: 'Turkmenistan is one of the most repressive and isolated countries in the world. The totalitarian government controls all aspects of life, including religion. The small church meets in secret.',
    christianChallenges: 'Extreme government persecution, similar to North Korea. The church is small, isolated, and under constant surveillance. Believers from a Muslim background face additional pressure from their families.',
    prayerIdeas: 'Pray for the protection of the secret house churches. Pray for strength and courage for the believers. Pray for the dictatorial regime to fall and for freedom to come to the nation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/turkmenistan/',
  },
  'United Arab Emirates': { 
    peopleGroupCount: 65, christianPercentage: 12.6, unreachedPercentage: 74.0, mainReligion: 'Islam',
    missionsText: 'The UAE has a large expatriate Christian population that enjoys considerable religious freedom in a modern, tolerant environment. Numerous churches serve these foreign communities. Ministry to Emiratis is not permitted.',
    christianChallenges: 'The freedom granted to expatriates does not extend to Emirati citizens, for whom conversion from Islam is a serious offense. The church is a transient community, making long-term discipleship a challenge.',
    prayerIdeas: 'Pray for the many expatriate churches to be a vibrant witness. Pray for wisdom in how to build bridges to the local community. Pray for Emiratis to have opportunities to hear the Gospel.',
    supportLink: 'https://prayercast.com/united-arab- emirates.html',
  },
  'Uzbekistan': {
    peopleGroupCount: 80, christianPercentage: 2.3, unreachedPercentage: 95.7, mainReligion: 'Islam',
    missionsText: 'The government exercises tight control over all religious activity. Only registered churches are legal, and registration is difficult to obtain. House churches face the risk of raids, fines, and arrests.',
    christianChallenges: 'Government surveillance and harassment are constant threats. Converts from Islam face severe pressure from their families and communities. There is a lack of Bibles and Christian resources in the Uzbek language.',
    prayerIdeas: 'Pray for greater religious freedom and for churches to be able to register. Pray for protection for house church members. Pray for more Christian literature to be made available.',
    supportLink: 'https://www.persecution.com/uzbekistan/',
  },
  'Vietnam': {
    peopleGroupCount: 113, christianPercentage: 8.2, unreachedPercentage: 54.0, mainReligion: 'Folk Religion/Buddhism',
    missionsText: 'The church in Vietnam, especially among ethnic minorities in the highlands, has grown explosively despite government control. The focus is on leadership training and discipleship for this rapidly expanding church.',
    christianChallenges: 'Government restrictions and persecution are the main challenges. There is a massive need for trained pastors and leaders to care for the millions of believers. Bibles can be scarce in rural areas.',
    prayerIdeas: 'Pray for wisdom and protection for house church leaders. Pray for an end to persecution against ethnic minority Christians. Pray for the provision of theological training and Bibles.',
    supportLink: 'https://www.opendoors.org/en-US/countries/vietnam/',
  },
  'Yemen': {
    peopleGroupCount: 42, christianPercentage: 0.1, unreachedPercentage: 99.8, mainReligion: 'Islam',
    missionsText: 'Yemen is experiencing one of the world\'s worst humanitarian crises due to a prolonged civil war. Overt mission work is impossible. Ministry consists of humanitarian aid and remote media outreach.',
    christianChallenges: 'Extreme danger for believers. The humanitarian crisis makes basic survival the primary concern for everyone. The church is tiny, underground, and completely isolated.',
    prayerIdeas: 'Pray for an end to the war and for humanitarian aid to reach those in need. Pray for the protection of every secret believer in Yemen. Pray for peace for this shattered nation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/yemen/',
  },
  
  // Europe
  'Albania': { 
    peopleGroupCount: 10, christianPercentage: 16.9, unreachedPercentage: 66.8, mainReligion: 'Islam',
    missionsText: 'After decades of enforced atheism under communism, Albania has religious freedom. The evangelical church is small but growing. Missions focus on church planting, youth work, and compassionate ministry in a poor country.',
    christianChallenges: 'There is a spiritual vacuum left by communism, but many are turning to Islam or materialism rather than Christianity. The church is young and needs more mature leaders.',
    prayerIdeas: 'Pray for the Albanian church to grow in depth and influence. Pray for effective outreach to the Muslim majority. Pray for the nation to find true hope and healing in Christ.',
    supportLink: 'https://www.abwe.org/work/fields/albania',
  },
  'Andorra': { 
    peopleGroupCount: 6, christianPercentage: 89.5, unreachedPercentage: 0.8, mainReligion: 'Christianity',
    missionsText: 'This tiny principality is nominally Catholic, but very secular and materialistic. The evangelical presence is very small. The need is for evangelism that connects with a wealthy, postmodern population.',
    christianChallenges: 'Materialism, secularism, and spiritual indifference are the main barriers. People see no need for God.',
    prayerIdeas: 'Pray for the small evangelical community to have a bold witness. Pray for the hearts of Andorrans to be stirred for spiritual reality.',
    supportLink: 'https://prayercast.com/andorra.html',
  },
  'Austria': { 
    peopleGroupCount: 41, christianPercentage: 68.2, unreachedPercentage: 9.3, mainReligion: 'Christianity',
    missionsText: 'Austria has a rich Christian history but is now largely secular. Missions focus on church planting, student ministry, and reaching out to the large immigrant population, especially from Muslim countries.',
    christianChallenges: 'Spiritual apathy and intellectual skepticism are high. Many see the church as a historical relic. The evangelical church is small.',
    prayerIdeas: 'Pray for revival in a nation of great composers and thinkers. Pray for the church to effectively engage with postmodern questions. Pray for fruitful ministry among refugees.',
    supportLink: 'https://www.gemission.org/mission-fields/austria',
  },
  'Belarus': { 
    peopleGroupCount: 31, christianPercentage: 71.3, unreachedPercentage: 5.6, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Often called "Europe\'s last dictatorship," Belarus has a repressive government that restricts religious freedom. The evangelical church is small and operates under pressure.',
    christianChallenges: 'The government views non-Orthodox churches with suspicion and restricts their activities. Evangelism is difficult. There is a climate of fear.',
    prayerIdeas: 'Pray for freedom and justice for the people of Belarus. Pray for the protection and encouragement of the evangelical church. Pray for pastors to have wisdom and courage.',
    supportLink: 'https://www.imb.org/europe/belarus/',
  },
  'Belgium': { 
    peopleGroupCount: 65, christianPercentage: 54.0, unreachedPercentage: 11.1, mainReligion: 'Christianity',
    missionsText: 'Belgium is a deeply secular, post-Catholic nation. Brussels, as the capital of the EU, is a strategic center. Missions focus on church planting, student work, and outreach to the large North African Muslim community.',
    christianChallenges: 'Postmodernism and secularism are dominant. The evangelical church is tiny. Reaching the Muslim population is a major challenge and opportunity.',
    prayerIdeas: 'Pray for church planting efforts in this spiritual wasteland. Pray for unity between Flemish and Walloon believers. Pray for effective ministry in the Muslim communities of Brussels.',
    supportLink: 'https.www.abwe.org/work/fields/belgium',
  },
  'Bosnia and Herz.': { 
    peopleGroupCount: 15, christianPercentage: 45.4, unreachedPercentage: 52.4, mainReligion: 'Islam',
    missionsText: 'The country is ethnically and religiously divided between Bosniak Muslims, Orthodox Serbs, and Catholic Croats. The evangelical church is miniscule. Ministry focuses on reconciliation and trauma healing from the war in the 1990s.',
    christianChallenges: 'Religion is tied to ethnic identity, so to choose an evangelical faith is seen as a betrayal of one\'s people. The trauma of war has left deep spiritual wounds.',
    prayerIdeas: 'Pray for the tiny evangelical church to be a powerful model of multi-ethnic unity. Pray for healing from the hatreds of the past. Pray for a spiritual breakthrough in all three communities.',
    supportLink: 'https://www.gemission.org/mission-fields/bosnia-herzegovina',
  },
  'Bulgaria': { 
    peopleGroupCount: 34, christianPercentage: 62.7, unreachedPercentage: 18.2, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'The evangelical church in Bulgaria, especially among the Roma (Gypsy) people, has seen significant growth. The focus is on leadership training and discipleship for this growing but often poor and marginalized church.',
    christianChallenges: 'The Roma churches are vibrant but lack trained leaders and resources. They also face severe social discrimination. The broader Bulgarian population is largely secular or nominally Orthodox.',
    prayerIdeas: 'Pray for the Roma church to be strengthened and equipped. Pray for believers to overcome ethnic prejudice. Pray for revival in the historic Orthodox Church.',
    supportLink: 'https://www.abwe.org/work/fields/bulgaria',
  },
  'Croatia': { 
    peopleGroupCount: 23, christianPercentage: 89.5, unreachedPercentage: 2.1, mainReligion: 'Christianity',
    missionsText: 'Croatian identity is strongly tied to the Catholic Church. The evangelical church is very small. Missions focus on church planting and youth ministry in a post-war, post-communist, and increasingly secular context.',
    christianChallenges: 'Cultural Catholicism is a major barrier to personal faith. The evangelical church is small and viewed as a "sect." Young people are increasingly secular.',
    prayerIdeas: 'Pray for the growth of a vibrant, indigenous evangelical church. Pray for healing from the wounds of war. Pray for Croatians to discover a personal relationship with Jesus.',
    supportLink: 'https://www.gemission.org/mission-fields/croatia',
  },
  'Cyprus': { 
    peopleGroupCount: 13, christianPercentage: 72.3, unreachedPercentage: 24.6, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'The island is divided between the Greek Cypriot south and the Turkish Cypriot north. Ministry in the south is to the nominally Orthodox population. Ministry in the north is to the unreached Turkish Cypriot Muslims.',
    christianChallenges: 'In the south, nominalism is the challenge. In the north, it is reaching a Muslim population. Bridging the divide between the two communities is a work of reconciliation.',
    prayerIdeas: 'Pray for a just and peaceful resolution to the island\'s division. Pray for revival among Greek Cypriots and a breakthrough among Turkish Cypriots.',
    supportLink: 'https://prayercast.com/cyprus.html',
  },
  'Czechia': {
    peopleGroupCount: 29, christianPercentage: 11.5, unreachedPercentage: 3.5, mainReligion: 'Irreligion',
    missionsText: 'Czechia is one of the most atheistic and secular nations in Europe. Missions focus on relational evangelism, apologetics, and creative arts ministries to engage a skeptical population.',
    christianChallenges: 'Widespread spiritual apathy and skepticism are the greatest barriers. The church is very small and can feel discouraged. Reaching the younger generation is a particular challenge.',
    prayerIdeas: 'Pray for a spiritual awakening in the heart of Europe. Pray for Czech believers to be bold and creative in their witness. Pray for ministries working with students and young professionals.',
    supportLink: 'https://www.gemission.org/mission-fields/czech-republic',
  },
  'Denmark': { 
    peopleGroupCount: 52, christianPercentage: 75.3, unreachedPercentage: 5.4, mainReligion: 'Christianity',
    missionsText: 'Denmark is a highly secular, post-Christian society where most people are members of the state Lutheran church but few attend or believe. Missions focus on relational evangelism and church planting.',
    christianChallenges: 'Widespread unbelief and spiritual indifference are the main challenges. Christianity is seen as irrelevant. The evangelical church is small.',
    prayerIdeas: 'Pray for the Danes to recognize their spiritual hunger. Pray for the small evangelical church to be a compelling witness. Pray for effective outreach to immigrants.',
    supportLink: 'https://www.gemission.org/mission-fields/denmark',
  },
  'Estonia': { 
    peopleGroupCount: 29, christianPercentage: 28.4, unreachedPercentage: 14.8, mainReligion: 'Irreligion',
    missionsText: 'Estonia is one of the least religious countries in the world, a legacy of Soviet occupation. The church is small. Missions focus on rebuilding the church through evangelism and discipleship.',
    christianChallenges: 'Atheism and agnosticism are the dominant beliefs. The church is small and under-resourced. The trauma of the past has made people distrustful.',
    prayerIdeas: 'Pray for spiritual renewal in Estonia. Pray for the church to grow in confidence and numbers. Pray for healing from the wounds of the Soviet era.',
    supportLink: 'https://www.imb.org/europe/estonia/',
  },
  'Finland': { 
    peopleGroupCount: 36, christianPercentage: 68.7, unreachedPercentage: 4.8, mainReligion: 'Christianity',
    missionsText: 'Like other Nordic countries, Finland is highly secular despite a majority being members of the state Lutheran church. The need is for personal evangelism and church planting.',
    christianChallenges: 'Nominalism and secularism. Most Finns do not see faith as relevant to their daily lives. Alcoholism is a significant social problem.',
    prayerIdeas: 'Pray for Finns to move from a cultural faith to a personal relationship with Christ. Pray for the growth of vibrant, witnessing churches.',
    supportLink: 'https://prayercast.com/finland.html',
  },
  'France': {
    peopleGroupCount: 137, christianPercentage: 58.1, unreachedPercentage: 17.5, mainReligion: 'Christianity',
    missionsText: 'Despite its Catholic heritage, France is deeply secular. Evangelical churches are small but growing, particularly among immigrant communities. Missions focus on church planting, student ministry, and reaching the large Muslim population.',
    christianChallenges: 'Aggressive secularism and intellectual skepticism make many resistant to the Gospel. The evangelical church is small and lacks resources. Reaching disillusioned post-Catholic generations is difficult.',
    prayerIdeas: 'Pray for the growth and vitality of the French evangelical church. Pray for effective outreach to Muslim communities. Pray for a new openness to faith in a secular society.',
    supportLink: 'https://www.gemission.org/mission-fields/france',
  },
  'Germany': { 
    peopleGroupCount: 114, christianPercentage: 52.0, unreachedPercentage: 13.9, mainReligion: 'Christianity',
    missionsText: 'The land of the Reformation is now a post-Christian mission field. The state churches (Lutheran and Catholic) are wealthy but largely empty. Missions focus on church planting, university ministry, and outreach to large immigrant and refugee populations.',
    christianChallenges: 'Secularism in the west and entrenched atheism in the east (former GDR) are major barriers. The church is often seen as irrelevant. Reaching millions of Muslims who now live in Germany is a key task.',
    prayerIdeas: 'Pray for a new Reformation in Germany. Pray for vibrant, Gospel-preaching churches to be planted. Pray for the German church to have a vision for reaching the refugees in their midst.',
    supportLink: 'https://www.gemission.org/mission-fields/germany',
  },
  'Greece': { 
    peopleGroupCount: 32, christianPercentage: 88.1, unreachedPercentage: 3.1, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'To be Greek is to be Orthodox. This nationalistic expression of faith makes ministry for evangelicals very challenging. Missions focus on careful, relational evangelism and serving refugees.',
    christianChallenges: 'Evangelicals are a tiny minority and often viewed as a foreign cult that is anti-Greek. The cultural power of the Orthodox Church is immense.',
    prayerIdeas: 'Pray for favor and open doors for the Greek evangelical church. Pray for Greeks to understand the difference between cultural religion and a personal relationship with Christ. Pray for the vast refugee ministry.',
    supportLink: 'https://www.gemission.org/mission-fields/greece',
  },
  'Hungary': { 
    peopleGroupCount: 32, christianPercentage: 53.9, unreachedPercentage: 6.9, mainReligion: 'Christianity',
    missionsText: 'Hungary has a Christian heritage but was deeply affected by communism and is now increasingly secular. Missions focus on church planting and discipleship.',
    christianChallenges: 'A history of formalism in the state churches and cynicism from the communist era makes people resistant to the Gospel. There is a great need for vibrant, authentic Christian communities.',
    prayerIdeas: 'Pray for the Hungarian church to be revived. Pray for church planters to have success in establishing new congregations. Pray for a genuine spiritual movement beyond just cultural Christianity.',
    supportLink: 'https://www.abwe.org/work/fields/hungary',
  },
  'Iceland': { 
    peopleGroupCount: 10, christianPercentage: 75.8, unreachedPercentage: 0.7, mainReligion: 'Christianity',
    missionsText: 'While most Icelanders are nominally Lutheran, the society is highly secular and individualistic. The evangelical church is very small. The need is for pioneer evangelism.',
    christianChallenges: 'Spiritual indifference is the main barrier. Most Icelanders are functionally atheists or agnostics.',
    prayerIdeas: 'Pray for a spiritual awakening in this land of "fire and ice." Pray for the small number of believers to be encouraged. Pray for more workers to go to this needy field.',
    supportLink: 'https://prayercast.com/iceland.html',
  },
  'Ireland': { 
    peopleGroupCount: 37, christianPercentage: 78.3, unreachedPercentage: 1.6, mainReligion: 'Christianity',
    missionsText: 'Once a bastion of Catholicism, Ireland has become rapidly secularized in recent decades due to church scandals. Missions focus on church planting in a post-Catholic, postmodern environment.',
    christianChallenges: 'The negative legacy of the Catholic Church has made many people hostile to all forms of organized religion. Secularism and materialism are strong.',
    prayerIdeas: 'Pray for the Irish people to discover the grace of the Gospel, separate from the failings of the institutional church. Pray for the growth of a healthy, vibrant evangelical movement.',
    supportLink: 'https://www.gemission.org/mission-fields/ireland',
  },
  'Italy': { 
    peopleGroupCount: 59, christianPercentage: 74.5, unreachedPercentage: 3.1, mainReligion: 'Christianity',
    missionsText: 'The heart of the Roman Catholic Church is a major mission field. Most Italians are culturally Catholic but not born-again believers. Missions focus on church planting and evangelism to reach a population that thinks it is already Christian.',
    christianChallenges: 'The tradition and culture of Catholicism is the greatest barrier to the evangelical Gospel. The evangelical church is small and often fragmented.',
    prayerIdeas: 'Pray for Italians to have a personal encounter with Jesus Christ. Pray for the planting of new churches in the thousands of towns with no evangelical witness. Pray for outreach to immigrants.',
    supportLink: 'https://www.abwe.org/work/fields/italy',
  },
  'Kosovo': { 
    peopleGroupCount: 7, christianPercentage: 2.2, unreachedPercentage: 97.4, mainReligion: 'Islam',
    missionsText: 'This young nation is ethnically Albanian and predominantly Muslim. The evangelical church is small but has grown since the Kosovo War. Missions focus on church planting and compassionate ministry.',
    christianChallenges: 'Kosovar identity is tied to Islam. Converts can face pressure from family and society. The church is young and in need of trained leaders.',
    prayerIdeas: 'Pray for the growth and maturity of the Kosovar church. Pray for lasting peace and reconciliation in the region. Pray for more Kosovars to be trained for ministry.',
    supportLink: 'https://www.gemission.org/mission-fields/kosovo',
  },
  'Latvia': { 
    peopleGroupCount: 29, christianPercentage: 55.1, unreachedPercentage: 16.4, mainReligion: 'Christianity',
    missionsText: 'Latvia is spiritually needy after decades of Soviet atheism. The Lutheran church is traditional and nominal. The evangelical church is small but active.',
    christianChallenges: 'The legacy of communism has left spiritual apathy and distrust. Alcoholism is a major social issue. There is a need for more trained Latvian church leaders.',
    prayerIdeas: 'Pray for revival in the Latvian church. Pray for relational evangelism to break through the cultural reserve. Pray for the church to address social problems.',
    supportLink: 'https://www.imb.org/europe/latvia/',
  },
  'Liechtenstein': { 
    peopleGroupCount: 4, christianPercentage: 80.3, unreachedPercentage: 0.5, mainReligion: 'Christianity',
    missionsText: 'This wealthy microstate is traditionally Catholic and highly secular. There is almost no evangelical presence.',
    christianChallenges: 'Materialism and spiritual indifference. People feel no need for God.',
    prayerIdeas: 'Pray for the first evangelical church to be planted among native Liechensteiners. Pray for a spiritual awakening.',
    supportLink: 'https://prayercast.com/liechtenstein.html',
  },
  'Lithuania': { 
    peopleGroupCount: 23, christianPercentage: 79.4, unreachedPercentage: 11.0, mainReligion: 'Christianity',
    missionsText: 'Lithuania is strongly Catholic, but also deeply affected by its Soviet past. The evangelical church is small. Missions focus on church planting and youth work.',
    christianChallenges: 'Cultural Catholicism and the spiritual vacuum left by communism are the main barriers. The social problems reveal a deep-seated hopelessness.',
    prayerIdeas: 'Pray for Lithuanians to find true hope in Christ. Pray for the growth of the evangelical church. Pray for ministries addressing suicide and addiction.',
    supportLink: 'https://www.imb.org/europe/lithuania/',
  },
  'Luxembourg': { 
    peopleGroupCount: 24, christianPercentage: 73.2, unreachedPercentage: 1.3, mainReligion: 'Christianity',
    missionsText: 'This wealthy, international country is nominally Catholic but very secular. The church is largely made up of expatriates. The need is for evangelism to the native Luxembourgers.',
    christianChallenges: 'Materialism and postmodernism. The native population is highly secularized and sees no need for faith.',
    prayerIdeas: 'Pray for the expatriate churches to have a vision for reaching Luxembourgers. Pray for a spiritual breakthrough among the local population.',
    supportLink: 'https://prayercast.com/luxembourg.html',
  },
  'Malta': { 
    peopleGroupCount: 6, christianPercentage: 90.0, unreachedPercentage: 1.1, mainReligion: 'Christianity',
    missionsText: 'Malta is one of the most staunchly Catholic countries in the world. The evangelical church is tiny and faces significant cultural opposition.',
    christianChallenges: 'The cultural identity is completely intertwined with Catholicism. To be evangelical is seen as being a traitor. The church is very small.',
    prayerIdeas: 'Pray for the small evangelical witness in Malta to be bold and winsome. Pray for Maltese people to discover a personal faith. Pray for ministry among migrants.',
    supportLink: 'https://www.gemission.org/mission-fields/malta',
  },
  'Moldova': { 
    peopleGroupCount: 23, christianPercentage: 87.4, unreachedPercentage: 10.3, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Europe\'s poorest country, Moldova is nominally Orthodox but has a growing and active evangelical church. Missions focus on leadership training, church planting, and compassionate ministries.',
    christianChallenges: 'Extreme poverty creates many social problems and makes the country vulnerable to human trafficking. The Orthodox Church can be hostile to evangelicals.',
    prayerIdeas: 'Pray for the Moldovan church as it serves Ukrainian refugees. Pray for economic hope for the people. Pray for the continued growth and maturity of the evangelical church.',
    supportLink: 'https://www.abwe.org/work/fields/moldova',
  },
  'Monaco': { 
    peopleGroupCount: 9, christianPercentage: 86.0, unreachedPercentage: 0.6, mainReligion: 'Christianity',
    missionsText: 'This playground for the rich and famous is nominally Catholic but completely secular in practice. The focus is on reaching a wealthy, transient, and materialistic population.',
    christianChallenges: 'Extreme wealth and materialism create a powerful idol that blinds people to their spiritual need. The population is transient.',
    prayerIdeas: 'Pray for a spiritual awakening among the world\'s elite who live and play in Monaco. Pray for the small Christian witness there.',
    supportLink: 'https://prayercast.com/monaco.html',
  },
  'Montenegro': { 
    peopleGroupCount: 10, christianPercentage: 75.8, unreachedPercentage: 19.3, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Montenegrin identity is tied to the Serbian Orthodox Church. The evangelical church is extremely small, with only a few hundred believers in the whole country.',
    christianChallenges: 'Strong cultural Orthodoxy. Evangelicals are seen as a foreign cult. The church is tiny and lacks resources.',
    prayerIdeas: 'Pray for the handful of Montenegrin believers to be strong in their faith. Pray for the planting of the first vibrant, indigenous churches. Pray for a spiritual breakthrough.',
    supportLink: 'https://www.imb.org/europe/montenegro/',
  },
  'Netherlands': { 
    peopleGroupCount: 65, christianPercentage: 39.7, unreachedPercentage: 3.7, mainReligion: 'Irreligion/Christianity',
    missionsText: 'Once a stronghold of the Reformation, the Netherlands is now one of the most secular countries in Europe. Missions focus on church planting in a post-Christian context and outreach in multicultural cities like Amsterdam.',
    christianChallenges: 'Aggressive secularism and widespread spiritual indifference. The "Bible Belt" is shrinking. Many beautiful old church buildings have been turned into apartments and shops.',
    prayerIdeas: 'Pray for a new revival in the land of Kuyper and Corrie ten Boom. Pray for church planters in the major cities. Pray for outreach to the many immigrant groups.',
    supportLink: 'https://www.abwe.org/work/fields/netherlands',
  },
  'N. Cyprus': { 
    peopleGroupCount: 5, christianPercentage: 0.5, unreachedPercentage: 99.4, mainReligion: 'Islam',
    missionsText: 'The Turkish Republic of Northern Cyprus is recognized only by Turkey. The population is Turkish Cypriot and mainland Turkish settlers, who are almost entirely Muslim. The Christian presence is tiny.',
    christianChallenges: 'This is an unreached people group. Turkish and Turkish Cypriot identity is tied to Islam. There is very little Christian witness.',
    prayerIdeas: 'Pray for a political solution that brings peace. Pray for Turkish Cypriots to have an opportunity to hear the Gospel. Pray for the first churches to be planted in Northern Cyprus.',
    supportLink: 'https://prayercast.com/northern-cyprus.html',
  },
  'North Macedonia': { 
    peopleGroupCount: 18, christianPercentage: 64.8, unreachedPercentage: 33.6, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'The country is divided between a Slavic Orthodox majority and a large Albanian Muslim minority. The evangelical church is small. Ministry focuses on church planting and reconciliation.',
    christianChallenges: 'National identity is tied to religion (Orthodox or Muslim), making it difficult for people to choose an evangelical faith. The evangelical church is small and needs more leaders.',
    prayerIdeas: 'Pray for the evangelical church to be a bridge of reconciliation between the two main ethnic groups. Pray for the growth of the church. Pray for political stability.',
    supportLink: 'https://www.imb.org/europe/macedonia/',
  },
  'Norway': { 
    peopleGroupCount: 36, christianPercentage: 68.7, unreachedPercentage: 3.4, mainReligion: 'Christianity',
    missionsText: 'Norway is a very secular, post-Christian nation, despite most people being members of the state church. Missions focus on evangelism and discipleship to counter nominalism.',
    christianChallenges: 'Spiritual apathy. Faith is seen as a private matter and is not discussed publicly. The evangelical church is small.',
    prayerIdeas: 'Pray for revival to sweep through the Norwegian churches. Pray for believers to have boldness to share their faith. Pray for a spiritual awakening in a comfortable and secular society.',
    supportLink: 'https://www.abwe.org/work/fields/norway',
  },
  'Poland': { 
    peopleGroupCount: 40, christianPercentage: 85.9, unreachedPercentage: 2.3, mainReligion: 'Christianity',
    missionsText: 'Poland\'s identity is deeply intertwined with the Catholic Church, which was a source of resistance to communism. The evangelical church is tiny but growing. Missions focus on church planting and youth ministry.',
    christianChallenges: 'The cultural dominance of Catholicism makes it difficult for people to consider a personal, evangelical faith. The church is very small and lacks resources.',
    prayerIdeas: 'Pray for the Polish people to discover the assurance of salvation by grace through faith. Pray for the growth of the evangelical church. Pray for the ministry to Ukrainian refugees.',
    supportLink: 'https://www.abwe.org/work/fields/poland',
  },
  'Portugal': { 
    peopleGroupCount: 32, christianPercentage: 84.4, unreachedPercentage: 1.8, mainReligion: 'Christianity',
    missionsText: 'Like its neighbor Spain, Portugal is traditionally Catholic but increasingly secular. The evangelical church is larger than in Spain but still a small minority. Missions focus on church planting and discipleship.',
    christianChallenges: 'Many Portuguese see themselves as Catholic but have no active faith. The evangelical church needs more trained leaders to disciple new believers and plant new churches.',
    prayerIdeas: 'Pray for revival in Portugal. Pray for the evangelical church to grow in unity and vision. Pray for more Portuguese to be called into ministry.',
    supportLink: 'https://www.abwe.org/work/fields/portugal',
  },
  'Romania': { 
    peopleGroupCount: 39, christianPercentage: 85.3, unreachedPercentage: 5.8, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Romania has one of the largest evangelical populations in Europe, a legacy of revival under communism. The church is active in evangelism and social work. The focus is on leadership training and missions sending.',
    christianChallenges: 'The Orthodox Church is culturally dominant and can be hostile to evangelicals. While large, the evangelical church needs to guard against nominalism and continue to mature in its theological depth.',
    prayerIdeas: 'Pray for the Romanian church to continue to be a light in the nation and a sending force for missions. Pray for believers to lead the way in fighting corruption. Pray for the training of the next generation of leaders.',
    supportLink: 'https://www.abwe.org/work/fields/romania',
  },
  'Russia': {
    peopleGroupCount: 193, christianPercentage: 73.6, unreachedPercentage: 13.9, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'The evangelical church in Russia grew after the fall of communism but now faces increasing restrictions. Ministry is focused on discipleship, social outreach, and planting churches among the nation\'s many ethnic minorities.',
    christianChallenges: 'Legal restrictions make public outreach and missionary work very difficult. The dominant Orthodox Church is often hostile to evangelicals. Vast distances and harsh climates make ministry in regions like Siberia challenging.',
    prayerIdeas: 'Pray for the repeal of restrictive laws. Pray for wisdom and boldness for Russian pastors. Pray for the church to be a voice of peace and truth.',
    supportLink: 'https://www.imb.org/russian-peoples/',
  },
  'San Marino': { 
    peopleGroupCount: 2, christianPercentage: 91.5, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'The world\'s oldest republic is staunchly Catholic by tradition but secular in practice. There is no known evangelical church in San Marino.',
    christianChallenges: 'The combination of cultural Catholicism and materialism makes this a very hard place for the Gospel.',
    prayerIdeas: 'Pray for the first evangelical believers to emerge in San Marino. Pray for a witness to be established in this unreached nation.',
    supportLink: 'https://prayercast.com/san-marino.html',
  },
  'Serbia': { 
    peopleGroupCount: 26, christianPercentage: 86.6, unreachedPercentage: 6.8, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Serbian national identity is deeply connected to the Orthodox Church. Evangelicals are a tiny minority and face suspicion. Missions focus on patient, relational church planting.',
    christianChallenges: 'Evangelicals are often seen as part of a Western plot against Serbia. The church is small and faces social hostility. The trauma of war has hardened many hearts.',
    prayerIdeas: 'Pray for the small Serbian church to be courageous and loving. Pray for healing from the wounds of nationalism and war. Pray for a breakthrough of the Gospel.',
    supportLink: 'https://www.imb.org/europe/serbia/',
  },
  'Slovakia': { 
    peopleGroupCount: 22, christianPercentage: 66.8, unreachedPercentage: 5.4, mainReligion: 'Christianity',
    missionsText: 'Slovakia is traditionally Catholic but, like its Czech neighbor, is becoming more secular. The evangelical church is small. The Roma community has seen significant church growth.',
    christianChallenges: 'The Roma churches are growing but are marginalized and need leadership training. Reaching the majority Slovak population requires overcoming spiritual indifference.',
    prayerIdeas: 'Pray for the equipping of Roma church leaders. Pray for a spiritual awakening among the Slovak people. Pray for unity between Roma and Slovak believers.',
    supportLink: 'https.www.gemission.org/mission-fields/slovakia',
  },
  'Slovenia': { 
    peopleGroupCount: 15, christianPercentage: 61.9, unreachedPercentage: 2.0, mainReligion: 'Christianity',
    missionsText: 'Slovenia is a secular, post-Catholic country with a tiny evangelical presence. Missions focus on pioneer church planting and student ministry.',
    christianChallenges: 'Postmodernism and secularism are the main barriers. The church is very small and can feel isolated.',
    prayerIdeas: 'Pray for the growth of a vibrant evangelical witness in Slovenia. Pray for more church planters to be raised up. Pray for students to encounter Christ.',
    supportLink: 'https://www.gemission.org/mission-fields/slovenia',
  },
  'Spain': { 
    peopleGroupCount: 81, christianPercentage: 75.2, unreachedPercentage: 3.5, mainReligion: 'Christianity',
    missionsText: 'Once the seat of the Inquisition, Spain is now a very secular, post-Catholic mission field. The evangelical church is small but has been growing, partly through immigration from Latin America. Church planting is the primary focus.',
    christianChallenges: 'A deep-seated rejection of its Catholic past has made many Spaniards hostile to all religion. Spiritual apathy and materialism are high.',
    prayerIdeas: 'Pray for the planting of churches in the thousands of towns with no evangelical witness. Pray for the Spanish church to reach its own people. Pray for revival in a spiritually dry land.',
    supportLink: 'https://www.gemission.org/mission-fields/spain',
  },
  'Sweden': { 
    peopleGroupCount: 80, christianPercentage: 57.6, unreachedPercentage: 7.7, mainReligion: 'Christianity/Irreligion',
    missionsText: 'Sweden is one of the most secular and individualistic countries in the world. Mission work is challenging and focuses on relational evangelism, apologetics, and ministry to immigrant communities, which are often more spiritually open than native Swedes.',
    christianChallenges: 'Widespread secularism, materialism, and a strong belief in scientific rationalism are the primary barriers to faith. Many Swedes view Christianity as outdated or irrelevant.',
    prayerIdeas: 'Pray for a spiritual awakening among native Swedes. Pray for the church to find creative and relevant ways to share the Gospel in a post-Christian context. Pray for the integration and discipleship of believers from immigrant backgrounds.',
    supportLink: 'https://www.gemission.org/mission-fields/sweden',
  },
  'Switzerland': { 
    peopleGroupCount: 52, christianPercentage: 61.2, unreachedPercentage: 2.5, mainReligion: 'Christianity',
    missionsText: 'The land of Calvin and Zwingli is now a very secular nation. The state churches are nominal. Missions focus on church planting and reaching a wealthy, educated, and skeptical population.',
    christianChallenges: 'Materialism, intellectualism, and spiritual complacency are the main barriers. People are comfortable and see no need for God.',
    prayerIdeas: 'Pray for a new Reformation to sweep Switzerland. Pray for the church to regain its prophetic voice. Pray for Swiss believers to have a passion for evangelism.',
    supportLink: 'https://www.gemission.org/mission-fields/switzerland',
  },
  'Ukraine': {
    peopleGroupCount: 110, christianPercentage: 83.8, unreachedPercentage: 8.9, mainReligion: 'Christianity (Orthodox)',
    missionsText: 'Before the 2022 invasion, Ukraine was a major hub of evangelical life and missionary sending in Eastern Europe. Now, the church is at the forefront of the humanitarian response, providing aid, shelter, and spiritual care.',
    christianChallenges: 'The trauma of war is the overwhelming challenge. Believers are ministering while also suffering loss and displacement. Pastors and chaplains are exhausted. Rebuilding lives and infrastructure will take generations.',
    prayerIdeas: 'Pray for an end to the war and for a just peace. Pray for strength and resources for the Ukrainian church to continue its heroic ministry. Pray for healing for a deeply traumatized nation.',
    supportLink: 'https://send.org/story/ukraine_crisis_how_to_pray',
  },
  'United Kingdom': { 
    peopleGroupCount: 202, christianPercentage: 46.2, unreachedPercentage: 11.5, mainReligion: 'Christianity',
    missionsText: 'The country that sent missionaries like Hudson Taylor and William Carey is now a mission field itself. The UK is deeply post-Christian. Missions focus on church planting, student ministry, and outreach to diverse and unreached immigrant communities.',
    christianChallenges: 'Aggressive secularism, postmodern relativism, and spiritual indifference are huge barriers. The legacy of the established church can be a hindrance. Reaching the massive South Asian Muslim population is a key challenge.',
    prayerIdeas: 'Pray for revival in the UK. Pray for the church to find a new confidence and voice in a secular age. Pray for a great harvest among the unreached diaspora peoples in London, Birmingham, and other cities.',
    supportLink: 'https://www.abwe.org/work/fields/united-kingdom',
  },

  // North America
  'Antigua and Barb.': { 
    peopleGroupCount: 8, christianPercentage: 76.4, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This Caribbean nation is predominantly Christian. The need is for discipleship to move people from cultural Christianity to a vibrant, personal faith.',
    christianChallenges: 'Nominalism and syncretism with folk beliefs are common. Many young people are more influenced by secular Western culture than the church.',
    prayerIdeas: 'Pray for revival and a deep work of discipleship. Pray for strong Christian families. Pray for the church to effectively reach the next generation.',
    supportLink: 'https://prayercast.com/antigua-and-barbuda.html',
  },
  'Bahamas': { 
    peopleGroupCount: 11, christianPercentage: 95.5, unreachedPercentage: 2.1, mainReligion: 'Christianity',
    missionsText: 'The Bahamas is overwhelmingly Christian. The focus is on discipleship and leadership training to counter nominalism and the effects of materialism from tourism.',
    christianChallenges: 'A comfortable, church-going culture can mask a lack of genuine faith. Social problems and the influence of a materialistic tourist culture are challenges.',
    prayerIdeas: 'Pray for the Bahamian church to move from membership to discipleship. Pray for the church to offer real solutions to social problems. Pray for resilience in the face of natural disasters.',
    supportLink: 'https://prayercast.com/bahamas.html',
  },
  'Barbados': { 
    peopleGroupCount: 8, christianPercentage: 75.6, unreachedPercentage: 1.0, mainReligion: 'Christianity',
    missionsText: 'Barbados has a strong Anglican heritage and is majority Christian. The need is for evangelism and discipleship to renew a nominal faith.',
    christianChallenges: 'Formal, traditional religion often lacks vibrant, personal faith. Secular influences are growing.',
    prayerIdeas: 'Pray for revival to sweep through the traditional churches. Pray for Barbadians to find a personal relationship with Christ.',
    supportLink: 'https://prayercast.com/barbados.html',
  },
  'Belize': { 
    peopleGroupCount: 14, christianPercentage: 74.3, unreachedPercentage: 4.8, mainReligion: 'Christianity',
    missionsText: 'This diverse, multicultural nation has a growing evangelical church. Missions focus on church planting, particularly among unreached Mayan groups and immigrants from neighboring countries.',
    christianChallenges: 'The church needs more trained leaders to disciple a growing but often doctrinally shallow church. Gang violence is a major threat to youth.',
    prayerIdeas: 'Pray for the continued growth and maturity of the church in Belize. Pray for protection and hope for young people at risk of gang violence. Pray for more pastors to be trained.',
    supportLink: 'https://www.abwe.org/work/fields/belize',
  },
  'Canada': { 
    peopleGroupCount: 468, christianPercentage: 53.3, unreachedPercentage: 10.3, mainReligion: 'Christianity',
    missionsText: 'Canada is a post-Christian nation with a rapidly declining Christian population. Missions focus on church planting in secular urban centers like Vancouver and Toronto, student ministry, and outreach to its many immigrant groups and First Nations peoples.',
    christianChallenges: 'Aggressive secularism and postmodern relativism. The church is declining and aging. Reaching the unreached First Nations communities requires deep cultural understanding and reconciliation.',
    prayerIdeas: 'Pray for a spiritual awakening in Canada. Pray for the planting of new, vibrant churches in the major cities. Pray for healing and fruitful ministry among the First Nations.',
    supportLink: 'https://www.namb.net/canada/',
  },
  'Costa Rica': { 
    peopleGroupCount: 31, christianPercentage: 79.2, unreachedPercentage: 2.2, mainReligion: 'Christianity',
    missionsText: 'Costa Rica has a large and growing evangelical church. It serves as a base for missions into other parts of Central America. The focus is on leadership development and missions mobilization.',
    christianChallenges: 'The prosperity gospel is influential. The church needs more theological depth and training for its many pastors.',
    prayerIdeas: 'Pray for Costa Rica to continue to be a stable, missionary-sending nation. Pray for sound doctrine to prevail in the churches. Pray against the influence of drug cartels.',
    supportLink: 'https://www.worldvision.org/our-work/country/costa-rica',
  },
  'Cuba': {
    peopleGroupCount: 20, christianPercentage: 59.2, unreachedPercentage: 17.5, mainReligion: 'Christianity',
    missionsText: 'The Cuban church has experienced remarkable growth despite decades of communist rule and restrictions. House churches have flourished. The need is for Bibles, resources, and leadership training.',
    christianChallenges: 'Government restrictions and surveillance persist. There is a great scarcity of Bibles and theological materials. Many pastors are undertrained and serve with few resources.',
    prayerIdeas: 'Pray for more Bibles and resources to get into the country. Pray for opportunities for pastoral training. Pray for the church to remain a source of hope during the economic crisis.',
    supportLink: 'https://www.persecution.com/cuba/',
  },
  'Dominica': { 
    peopleGroupCount: 6, christianPercentage: 94.4, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This "Nature Isle" is strongly Catholic, with a growing evangelical presence. The need is for discipleship and leadership training.',
    christianChallenges: 'Syncretism with folk beliefs exists. The church needs to be equipped to help people rebuild spiritually and physically after natural disasters.',
    prayerIdeas: 'Pray for the church to be a beacon of hope. Pray for protection from hurricanes. Pray for the training of local church leaders.',
    supportLink: 'https://prayercast.com/dominica.html',
  },
  'Dominican Rep.': { 
    peopleGroupCount: 20, christianPercentage: 79.8, unreachedPercentage: 1.6, mainReligion: 'Christianity',
    missionsText: 'The evangelical church is growing rapidly. Missions focus on leadership training, church planting, and ministry to the large population of impoverished Haitian migrants.',
    christianChallenges: 'The church needs more trained pastors to keep up with its growth. The prosperity gospel is influential. Showing Christ-like love to Haitian migrants is a major test of the church\'s character.',
    prayerIdeas: 'Pray for sound theological training to become widely available. Pray for the Dominican church to be a model of compassion and justice for their Haitian neighbors.',
    supportLink: 'https://www.worldvision.org/our-work/country/dominican-republic',
  },
  'El Salvador': { 
    peopleGroupCount: 18, christianPercentage: 80.9, unreachedPercentage: 2.3, mainReligion: 'Christianity',
    missionsText: 'The evangelical church has seen explosive growth and is now a major force in society. Missions now focus on discipleship, theological education, and addressing the root causes of violence.',
    christianChallenges: 'The legacy of violence has deeply traumatized society. Many are in church but need deep discipleship to overcome cycles of violence. The church must learn how to minister in a new political reality.',
    prayerIdeas: 'Pray for healing from trauma. Pray for the church to provide hope and a path away from violence for young people. Pray for wisdom for believers to engage with the complex political situation.',
    supportLink: 'https://www.worldvision.org/our-work/country/el-salvador',
  },
  'Greenland': { 
    peopleGroupCount: 6, christianPercentage: 96.1, unreachedPercentage: 1.5, mainReligion: 'Christianity',
    missionsText: 'This autonomous Danish territory is nominally Lutheran. The Inuit population struggles with major social problems. The need is for a vibrant, life-transforming Gospel witness.',
    christianChallenges: 'High rates of alcoholism, substance abuse, and suicide point to deep spiritual despair. The church is largely formal and traditional.',
    prayerIdeas: 'Pray for a powerful move of the Holy Spirit to bring hope and healing. Pray for effective ministries to address the social crises. Pray for Inuit believers to be raised up as leaders.',
    supportLink: 'https://prayercast.com/greenland.html',
  },
  'Grenada': { 
    peopleGroupCount: 8, christianPercentage: 96.4, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'The "Isle of Spice" is predominantly Christian. The need is for discipleship to combat nominalism and for the church to engage with youth culture.',
    christianChallenges: 'A church-going culture can mask a lack of personal faith. Young people are often more drawn to secular entertainment than to the church.',
    prayerIdeas: 'Pray for revival in Grenada. Pray for creative and effective youth ministries.',
    supportLink: 'https://prayercast.com/grenada.html',
  },
  'Guatemala': { 
    peopleGroupCount: 66, christianPercentage: 89.2, unreachedPercentage: 11.0, mainReligion: 'Christianity',
    missionsText: 'Guatemala has one of the largest evangelical populations in Latin America. The church is vibrant and growing. Missions focus on training leaders, reaching unreached indigenous groups, and social justice ministry.',
    christianChallenges: 'The church is wide but needs theological depth. Syncretism with Mayan traditional religions is common in indigenous communities. The prosperity gospel is also a major influence.',
    prayerIdeas: 'Pray for the theological strengthening of the Guatemalan church. Pray for effective outreach to the remaining unreached Mayan peoples. Pray for the church to be a powerful force against corruption and injustice.',
    supportLink: 'https://www.worldvision.org/our-work/country/guatemala',
  },
  'Haiti': {
    peopleGroupCount: 11, christianPercentage: 86.9, unreachedPercentage: 5.2, mainReligion: 'Christianity',
    missionsText: 'Haiti is the poorest country in the Western Hemisphere, wracked by political instability, gang violence, and natural disasters. Christian organizations are vital for providing education, healthcare, and humanitarian aid.',
    christianChallenges: 'The syncretism of Christianity with Voodoo is a major spiritual issue. Overwhelming poverty and constant crisis make long-term discipleship difficult. Pastors and believers are targets of kidnapping and violence.',
    prayerIdeas: 'Pray for an end to the gang violence and for a stable government. Pray for the protection of pastors and ministry workers. Pray for the Haitian church to find its hope in Christ alone.',
    supportLink: 'https://www.worldvision.org/our-work/country/haiti',
  },
  'Honduras': { 
    peopleGroupCount: 31, christianPercentage: 80.5, unreachedPercentage: 3.8, mainReligion: 'Christianity',
    missionsText: 'The evangelical church has grown significantly. The focus is on leadership training and ministries that offer an alternative to the endemic gang violence.',
    christianChallenges: 'Gang violence terrorizes communities and makes youth ministry both critical and dangerous. The church needs leaders equipped to disciple people in a context of trauma and poverty.',
    prayerIdeas: 'Pray for the power of the Gospel to break the cycle of violence. Pray for protection for pastors and youth workers. Pray for the church to be a place of healing and hope.',
    supportLink: 'https://www.worldvision.org/our-work/country/honduras',
  },
  'Jamaica': { 
    peopleGroupCount: 13, christianPercentage: 68.9, unreachedPercentage: 3.5, mainReligion: 'Christianity',
    missionsText: 'Jamaica has a vibrant and expressive church culture, but also faces major social problems. The need is for discipleship that leads to societal transformation.',
    christianChallenges: 'Syncretism with traditional beliefs exists. The church needs to offer real answers to the problems of violence, poverty, and family breakdown.',
    prayerIdeas: 'Pray for the Jamaican church to be a powerful force for peace and righteousness. Pray for discipleship to go deep and transform lives and communities.',
    supportLink: 'https://www.abwe.org/work/fields/jamaica',
  },
  'Mexico': {
    peopleGroupCount: 331, christianPercentage: 87.8, unreachedPercentage: 11.2, mainReligion: 'Christianity',
    missionsText: 'The evangelical church in Mexico is growing rapidly. Missions focus on planting churches in unreached rural areas and among indigenous groups, as well as urban ministry in megacities like Mexico City.',
    christianChallenges: 'Persecution in southern indigenous communities is a serious problem. Widespread cartel violence affects the entire country, and pastors are sometimes targeted for extortion or speaking out.',
    prayerIdeas: 'Pray for the protection and rights of believers in Chiapas and other southern states. Pray against the power of cartels. Pray for the continued growth and maturity of the Mexican church.',
    supportLink: 'https://www.persecution.com/mexico/',
  },
  'Nicaragua': {
    peopleGroupCount: 29, christianPercentage: 82.2, unreachedPercentage: 2.8, mainReligion: 'Christianity',
    missionsText: 'The church in Nicaragua is navigating a difficult political climate under an increasingly authoritarian government that views religious institutions with suspicion.',
    christianChallenges: 'Increasing government persecution and the erosion of religious freedom are the primary challenges. The climate of fear makes ministry and public witness difficult.',
    prayerIdeas: 'Pray for the release of imprisoned pastors and religious leaders. Pray for wisdom and courage for the Nicaraguan church to continue its ministry under pressure. Pray for a peaceful and just future for the nation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/nicaragua/',
  },
  'Panama': { 
    peopleGroupCount: 37, christianPercentage: 85.9, unreachedPercentage: 4.8, mainReligion: 'Christianity',
    missionsText: 'Panama has a growing evangelical church. Missions focus on reaching the professional and wealthy classes in Panama City, as well as unreached indigenous groups in remote jungle areas.',
    christianChallenges: 'Materialism is a challenge in the city. Reaching the remote indigenous groups requires difficult travel and cross-cultural ministry.',
    prayerIdeas: 'Pray for the Panamanian church to have a vision for all segments of its diverse society. Pray for laborers to go to the remote jungle tribes.',
    supportLink: 'https://www.imb.org/central-america/panama/',
  },
  'Puerto Rico': { 
    peopleGroupCount: 15, christianPercentage: 97.0, unreachedPercentage: 1.0, mainReligion: 'Christianity',
    missionsText: 'This US territory has a large and vibrant Pentecostal and charismatic church. The focus is on discipleship and sending missionaries from the island to other parts of the world.',
    christianChallenges: 'The church needs to bring hope and practical help to a society struggling with economic hardship. Nominalism can be an issue.',
    prayerIdeas: 'Pray for the economic recovery of the island. Pray for the Puerto Rican church to continue to be a source of hope and a missionary-sending force.',
    supportLink: 'https://www.namb.net/puerto-rico/',
  },
  'Saint Kitts and Nevis': { 
    peopleGroupCount: 5, christianPercentage: 85.3, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This small twin-island nation is predominantly Christian. The need is for discipleship to deepen a cultural faith.',
    christianChallenges: 'Nominalism and secular materialism are the primary challenges.',
    prayerIdeas: 'Pray for revival among the churches. Pray for believers to live out their faith vibrantly.',
    supportLink: 'https://prayercast.com/saint-kitts-and-nevis.html',
  },
  'Saint Lucia': { 
    peopleGroupCount: 5, christianPercentage: 91.3, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'Saint Lucia is majority Christian, with a strong Catholic background. The need is for discipleship and leadership training.',
    christianChallenges: 'A blend of folk Catholicism and traditional beliefs (obeah) exists. The church needs more trained local leaders.',
    prayerIdeas: 'Pray for Saint Lucians to find a deep, personal faith in Christ. Pray for the equipping of pastors.',
    supportLink: 'https://prayercast.com/saint-lucia.html',
  },
  'St. Vin. and Gren.': { 
    peopleGroupCount: 6, christianPercentage: 81.3, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This multi-island nation is majority Christian. The need is for deep discipleship and for the church to address social needs.',
    christianChallenges: 'Poverty and lack of opportunity for youth are major issues. The church must minister in the context of recovery from natural disasters.',
    prayerIdeas: 'Pray for the recovery and rebuilding efforts. Pray for the church to be a source of practical help and spiritual hope.',
    supportLink: 'https://prayercast.com/saint-vincent-and-the-grenadines.html',
  },
  'Trinidad and Tobago': { 
    peopleGroupCount: 16, christianPercentage: 63.2, unreachedPercentage: 19.8, mainReligion: 'Christianity',
    missionsText: 'This nation is ethnically and religiously diverse, with large Christian, Hindu, and Muslim populations. Missions focus on evangelism and discipleship among all groups.',
    christianChallenges: 'Reaching the Hindu and Muslim populations requires specific cross-cultural skills. The church is challenged to be a force for reconciliation between the ethnic groups.',
    prayerIdeas: 'Pray for a spiritual harvest among the non-Christian communities. Pray for the church to model ethnic unity and reconciliation. Pray against the spirit of violence.',
    supportLink: 'https://www.abwe.org/work/fields/trinidad-tobago',
  },
  'United States of America': {
    peopleGroupCount: 737,
    christianPercentage: 63,
    unreachedPercentage: 9.3,
    mainReligion: 'Christianity',
    missionsText: 'The US remains the largest missionary-sending country in the world. However, it is also a major mission field itself, with growing secularism and numerous unreached diaspora communities.',
    christianChallenges: 'Increasing secularism and post-Christian mindsets are making evangelism more challenging. Cultural polarization tempts the church to align with political factions rather than the Gospel. Nominalism remains widespread.',
    prayerIdeas: 'Pray for revival and for unity in the American church. Pray for wisdom for believers to engage a polarized culture with grace and truth. Pray for a renewed passion for local and global missions.',
    supportLink: 'https://www.namb.net/',
  },

  // Oceania
  'Australia': { 
    peopleGroupCount: 219, christianPercentage: 43.9, unreachedPercentage: 10.3, mainReligion: 'Christianity',
    missionsText: 'Australia is a secular, multicultural nation. Missions focus on church planting in post-Christian urban areas, and reaching the many diaspora groups and indigenous Aboriginal communities.',
    christianChallenges: 'Secularism, materialism, and spiritual indifference are the main barriers. Reaching the Aboriginal population requires overcoming a difficult history of injustice.',
    prayerIdeas: 'Pray for a spiritual awakening in Australia. Pray for the church to effectively reach both secular Aussies and the many immigrant groups. Pray for reconciliation and fruitful ministry with Aboriginal peoples.',
    supportLink: 'https://www.abwe.org/work/fields/australia',
  },
  'Fiji': { 
    peopleGroupCount: 25, christianPercentage: 64.4, unreachedPercentage: 32.2, mainReligion: 'Christianity',
    missionsText: 'Fiji has a large Christian population among the indigenous Fijians, but the large Indo-Fijian population is mostly Hindu or Muslim and largely unreached. The focus is on cross-cultural mission within the nation.',
    christianChallenges: 'The church is largely segregated along ethnic lines. The great challenge is for Fijian Christians to cross the cultural divide and share the Gospel with their Indo-Fijian neighbors.',
    prayerIdeas: 'Pray for a powerful missions movement from the Fijian church to the Indo-Fijian community. Pray for ethnic reconciliation and unity in the nation.',
    supportLink: 'https://prayercast.com/fiji.html',
  },
  'Kiribati': { 
    peopleGroupCount: 5, christianPercentage: 97.0, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This low-lying atoll nation is predominantly Christian. The need is for Bible training for pastors and for the church to address social issues.',
    christianChallenges: 'The looming threat of climate change creates a sense of hopelessness. The church needs leaders equipped to disciple their people in the face of an uncertain future.',
    prayerIdeas: 'Pray for the nation of Kiribati in the face of climate change. Pray for the church to be a source of ultimate hope and resilience.',
    supportLink: 'https://prayercast.com/kiribati.html',
  },
  'Marshall Islands': { 
    peopleGroupCount: 3, christianPercentage: 97.5, unreachedPercentage: 0.0, mainReligion: 'Christianity',
    missionsText: 'The Marshall Islands are majority Christian. The need is for discipleship and leadership training.',
    christianChallenges: 'A church-going culture needs to be deepened into true discipleship.',
    prayerIdeas: 'Pray for the spiritual health and maturity of the church. Pray for the nation as it faces environmental challenges.',
    supportLink: 'https://prayercast.com/marshall-islands.html',
  },
  'Micronesia': { 
    peopleGroupCount: 11, christianPercentage: 95.4, unreachedPercentage: 0.2, mainReligion: 'Christianity',
    missionsText: 'The Federated States of Micronesia are overwhelmingly Christian. The focus is on theological education for pastors, many of whom have little training.',
    christianChallenges: 'The logistical challenges of travel between islands make training difficult. Nominalism is common.',
    prayerIdeas: 'Pray for accessible, island-appropriate theological training to be established. Pray for revival among the churches.',
    supportLink: 'https://prayercast.com/micronesia.html',
  },
  'Nauru': { 
    peopleGroupCount: 3, christianPercentage: 95.8, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'The world\'s smallest island nation is majority Christian. The focus is on discipleship.',
    christianChallenges: 'The church must minister to a population with a difficult past and an uncertain future.',
    prayerIdeas: 'Pray for the Nauruan church to be a source of healing and hope.',
    supportLink: 'https://prayercast.com/nauru.html',
  },
  'New Caledonia': { 
    peopleGroupCount: 36, christianPercentage: 85.1, unreachedPercentage: 1.1, mainReligion: 'Christianity',
    missionsText: 'This French territory has a large indigenous Kanak Christian population. The need is for discipleship and reconciliation between the Kanak and European communities.',
    christianChallenges: 'Ethnic tensions affect the church. There is a need for leaders who can bridge the cultural divide.',
    prayerIdeas: 'Pray for the church to be a model of reconciliation. Pray for a peaceful political future for the territory.',
    supportLink: 'https://prayercast.com/new-caledonia.html',
  },
  'New Zealand': { 
    peopleGroupCount: 122, christianPercentage: 37.3, unreachedPercentage: 10.7, mainReligion: 'Irreligion/Christianity',
    missionsText: 'New Zealand is a secular nation where more people claim no religion than identify as Christian. Missions focus on church planting and reaching a skeptical, post-Christian population.',
    christianChallenges: 'Spiritual apathy and secularism are the main barriers. Reaching the Maori requires culturally sensitive ministry that honors their heritage.',
    prayerIdeas: 'Pray for a spiritual reawakening in New Zealand. Pray for the church to effectively engage with a secular culture. Pray for the growth of the Maori church.',
    supportLink: 'https://www.abwe.org/work/fields/new-zealand',
  },
  'Palau': { 
    peopleGroupCount: 6, christianPercentage: 89.8, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'Palau is majority Christian. The need is for discipleship and leadership training.',
    christianChallenges: 'A comfortable Christianity needs to be challenged to grow into deep discipleship.',
    prayerIdeas: 'Pray for the Palauan church to have a vision for missions beyond its own shores.',
    supportLink: 'https://prayercast.com/palau.html',
  },
  'Papua New Guinea': {
    peopleGroupCount: 887, christianPercentage: 95.6, unreachedPercentage: 12.0, mainReligion: 'Christianity',
    missionsText: 'With over 800 languages, PNG is a major focus for Bible translation and pioneer missions. The difficult terrain and tribal cultures make ministry challenging but fruitful.',
    christianChallenges: 'Syncretism, mixing Christianity with traditional animistic beliefs and witchcraft, is a major issue. The logistical challenges of reaching remote villages are immense. A lack of trained leaders is critical.',
    prayerIdeas: 'Pray for the work of Bible translators and pioneer missionaries. Pray for believers to be set free from traditional fears and practices. Pray for peace between warring tribes.',
    supportLink: 'https://ethnos360.org/countries/papua-new-guinea',
  },
  'Samoa': { 
    peopleGroupCount: 3, christianPercentage: 97.0, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'Samoan society is deeply Christian, with the motto "Samoa is founded on God." The focus is on discipleship to ensure the faith is genuine and not just cultural.',
    christianChallenges: 'A strong religious culture can sometimes prevent people from examining their own personal faith. There is a need for theological depth.',
    prayerIdeas: 'Pray for the Samoan church to continue as a strong Christian witness in the Pacific. Pray for a new generation to embrace a personal faith.',
    supportLink: 'https://prayercast.com/samoa.html',
  },
  'Solomon Is.': { 
    peopleGroupCount: 97, christianPercentage: 97.6, unreachedPercentage: 1.0, mainReligion: 'Christianity',
    missionsText: 'The Solomon Islands are overwhelmingly Christian, a legacy of revival. The need is for Bible translation into the many local languages and for leadership training.',
    christianChallenges: 'Syncretism with traditional Melanesian beliefs is still a challenge. The church needs more resources and trained leaders.',
    prayerIdeas: 'Pray for the completion of Bible translation projects. Pray for the church to be an agent of peace and stability. Pray for the training of pastors.',
    supportLink: 'https://www.wycliffe.org/prayer/posts/solomon-islands',
  },
  'Tonga': { 
    peopleGroupCount: 4, christianPercentage: 98.9, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This Pacific kingdom is devoutly Christian. The focus is on discipleship and mobilizing the Tongan church for missions.',
    christianChallenges: 'A culturally strong faith needs to be continually deepened through discipleship. The church must minister to a nation recovering from natural disaster.',
    prayerIdeas: 'Pray for the recovery of the nation. Pray for the Tongan church to be a light to other Pacific nations.',
    supportLink: 'https://prayercast.com/tonga.html',
  },
  'Tuvalu': { 
    peopleGroupCount: 2, christianPercentage: 98.4, unreachedPercentage: 0.1, mainReligion: 'Christianity',
    missionsText: 'This tiny atoll nation is almost entirely Christian. The church is central to life.',
    christianChallenges: 'The church must provide hope and guidance to a nation facing the potential loss of their entire homeland.',
    prayerIdeas: 'Pray for God\'s mercy on the nation of Tuvalu. Pray for the church to be strong and to lead their people with faith in the face of an uncertain future.',
    supportLink: 'https://prayercast.com/tuvalu.html',
  },
  'Vanuatu': { 
    peopleGroupCount: 114, christianPercentage: 93.3, unreachedPercentage: 1.1, mainReligion: 'Christianity',
    missionsText: 'Vanuatu has a strong Christian heritage. Missions focus on Bible translation, leadership training, and discipleship to counter the influence of traditional beliefs and cargo cults.',
    christianChallenges: 'Syncretism with "kastom" (traditional culture) is a major issue. The logistical challenge of ministering across 80 islands is significant.',
    prayerIdeas: 'Pray for the church to be grounded in biblical truth. Pray for protection from natural disasters. Pray for the training of leaders for every island.',
    supportLink: 'https://prayercast.com/vanuatu.html',
  },

  // South America
  'Argentina': { 
    peopleGroupCount: 154, christianPercentage: 85.4, unreachedPercentage: 3.9, mainReligion: 'Christianity',
    missionsText: 'Argentina has a growing and vibrant evangelical church. It has moved from being a mission field to a mission-sending force. The focus is on church planting in unreached middle and upper-class communities, and on missions mobilization.',
    christianChallenges: 'A deeply entrenched cultural Catholicism can be a barrier. The church needs more leaders trained to a high level to engage the intellectual classes. Economic instability affects church life.',
    prayerIdeas: 'Pray for the Argentine church to continue to grow as a missionary-sending movement. Pray for political and economic stability. Pray for a breakthrough in the upper classes.',
    supportLink: 'https://comibam.org/paises/argentina/',
  },
  'Bolivia': { 
    peopleGroupCount: 57, christianPercentage: 88.5, unreachedPercentage: 10.1, mainReligion: 'Christianity',
    missionsText: 'The evangelical church in Bolivia has grown significantly, especially among the indigenous Quechua and Aymara peoples. The focus is on leadership training and discipleship that addresses deep-seated syncretism.',
    christianChallenges: 'Syncretism, blending Christianity with traditional Andean folk beliefs (e.g., worship of Pachamama, or "Mother Earth"), is a major challenge for the church.',
    prayerIdeas: 'Pray for believers to be set free from all forms of syncretism. Pray for the training of indigenous church leaders. Pray for unity and reconciliation in a divided nation.',
    supportLink: 'https://www.worldvision.org/our-work/country/bolivia',
  },
  'Brazil': {
    peopleGroupCount: 345, christianPercentage: 88.2, unreachedPercentage: 2.8, mainReligion: 'Christianity',
    missionsText: 'Brazil is a global missions powerhouse, sending thousands of missionaries worldwide. Internally, the focus is on reaching uncontacted tribes in the Amazon and ministering in crime-ridden urban favelas.',
    christianChallenges: 'The prosperity gospel is extremely prevalent and has caused widespread theological confusion. Social and political divisions can create disunity in the church. Reaching the remaining indigenous tribes is a difficult and dangerous task.',
    prayerIdeas: 'Pray for a movement of sound biblical teaching to counter false gospels. Pray for the Brazilian church to use its influence for justice and righteousness. Pray for protection and wisdom for those ministering in the Amazon.',
    supportLink: 'https://comibam.org/',
  },
  'Chile': { 
    peopleGroupCount: 76, christianPercentage: 79.9, unreachedPercentage: 3.5, mainReligion: 'Christianity',
    missionsText: 'Chile has a large Pentecostal church, a legacy of early 20th-century revival. However, the country is rapidly secularizing. Missions focus on reaching the younger, postmodern generation and revitalizing the church.',
    christianChallenges: 'Secularism and postmodernism are making major inroads, especially among the youth. The church can be insular and needs a new vision for engaging its changing culture.',
    prayerIdeas: 'Pray for a fresh move of the Spirit in the Chilean church. Pray for creative and effective ways to reach the younger generation. Pray for the church to speak with a relevant voice into the national conversation.',
    supportLink: 'https://www.abwe.org/work/fields/chile',
  },
  'Colombia': {
    peopleGroupCount: 114, christianPercentage: 92.5, unreachedPercentage: 3.2, mainReligion: 'Christianity',
    missionsText: 'The Colombian church has grown resilient and vibrant through decades of civil conflict. It now has a strong vision for missions, particularly to unreached indigenous groups and areas previously controlled by guerrilla forces.',
    christianChallenges: 'Pastors and church leaders in rural areas are often threatened, extorted, or killed by armed groups for their opposition to violence and their work with youth. Discipling a church that has known so much trauma is a major task.',
    prayerIdeas: 'Pray for the protection of pastors in high-risk areas. Pray for the full implementation of peace and for an end to cartel violence. Pray for the church to be a powerful agent of healing and reconciliation.',
    supportLink: 'https://www.opendoors.org/en-US/countries/colombia/',
  },
  'Ecuador': { 
    peopleGroupCount: 80, christianPercentage: 87.5, unreachedPercentage: 4.5, mainReligion: 'Christianity',
    missionsText: 'The evangelical church has seen steady growth, particularly among indigenous peoples in the highlands and the Amazon. The need is for leadership training and Bible translation.',
    christianChallenges: 'The recent explosion of violence creates a dangerous environment for ministry. The church needs to be equipped to offer hope in a society gripped by fear. Syncretism with traditional beliefs is an issue in indigenous communities.',
    prayerIdeas: 'Pray for peace and for the government to be effective against the cartels. Pray for the protection of pastors and their families. Pray for the church to be a refuge and a light in dark times.',
    supportLink: 'https://www.worldvision.org/our-work/country/ecuador',
  },
  'Falkland Is.': { 
    peopleGroupCount: 2, christianPercentage: 57.1, unreachedPercentage: 0.0, mainReligion: 'Christianity',
    missionsText: 'This remote British territory has a small, tight-knit community. The need is for pastoral care and discipleship for the local population.',
    christianChallenges: 'Isolation and a small community can lead to spiritual stagnation.',
    prayerIdeas: 'Pray for the spiritual vitality of the churches in the Falklands.',
    supportLink: 'https://prayercast.com/falkland-islands.html',
  },
  'Fr. Guiana': { 
    peopleGroupCount: 38, christianPercentage: 66.8, unreachedPercentage: 11.2, mainReligion: 'Christianity',
    missionsText: 'This overseas department of France is a mix of cultures, including indigenous Amerindians, Maroons (descendants of escaped slaves), and Europeans. Missions focus on reaching these diverse and often remote people groups.',
    christianChallenges: 'Reaching remote tribal and Maroon communities in the rainforest is a major logistical and cross-cultural challenge. Many are involved in syncretistic folk religions.',
    prayerIdeas: 'Pray for laborers to go to the unreached peoples of the interior. Pray for Bible translation and for the church to be established among every group.',
    supportLink: 'https://prayercast.com/french-guiana.html',
  },
  'Guyana': { 
    peopleGroupCount: 14, christianPercentage: 62.7, unreachedPercentage: 19.9, mainReligion: 'Christianity',
    missionsText: 'Guyana is religiously diverse, with Christian, Hindu, and Muslim populations. Missions focus on evangelism and church planting among the Indo-Guyanese (mostly Hindu and Muslim) and in the remote interior.',
    christianChallenges: 'Reaching the Indo-Guyanese population is the greatest missional challenge. The church is predominantly Afro-Guyanese.',
    prayerIdeas: 'Pray for a great harvest among the Hindus and Muslims of Guyana. Pray for the church to manage the coming oil wealth with integrity. Pray for workers for the interior.',
    supportLink: 'https://www.abwe.org/work/fields/guyana',
  },
  'Paraguay': { 
    peopleGroupCount: 29, christianPercentage: 96.0, unreachedPercentage: 1.4, mainReligion: 'Christianity',
    missionsText: 'The evangelical church in Paraguay has grown significantly. The focus is on leadership training and reaching the unreached indigenous groups of the Gran Chaco region.',
    christianChallenges: 'There is a great need for more trained pastors to disciple the growing church. Reaching the remaining indigenous groups requires dedicated cross-cultural missionaries.',
    prayerIdeas: 'Pray for the provision of quality theological education. Pray for a missionary vision within the Paraguayan church to reach its own unreached peoples.',
    supportLink: 'https://www.abwe.org/work/fields/paraguay',
  },
  'Peru': { 
    peopleGroupCount: 101, christianPercentage: 89.3, unreachedPercentage: 8.9, mainReligion: 'Christianity',
    missionsText: 'The evangelical church has seen explosive growth, especially among the indigenous Quechua people of the Andes. Missions focus on training leaders for this massive harvest and planting churches in unreached areas of the Amazon.',
    christianChallenges: 'The rapid growth has created a crisis of leadership, with hundreds of thousands of believers and not enough trained pastors. Syncretism with traditional Andean beliefs is also a major issue.',
    prayerIdeas: 'Pray for a massive movement of leadership training and theological education. Pray for the Quechua church to mature and become a missionary force. Pray for workers to go to the unreached tribes of the Amazon.',
    supportLink: 'https://www.abwe.org/work/fields/peru',
  },
  'Suriname': { 
    peopleGroupCount: 22, christianPercentage: 51.7, unreachedPercentage: 9.3, mainReligion: 'Christianity',
    missionsText: 'Suriname is an incredibly diverse country, with Christian, Hindu, Muslim, and Maroon populations. The focus is on cross-cultural evangelism and Bible translation for the many groups.',
    christianChallenges: 'The sheer diversity of cultures and religions makes it a complex mission field. Reaching the unreached Maroon (descendants of escaped slaves) and indigenous peoples in the interior is a priority.',
    prayerIdeas: 'Pray for the church in Suriname to have a vision for reaching all the people groups in their nation. Pray for Bible translation work.',
    supportLink: 'https://www.ethnos360.org/countries/suriname',
  },
  'Uruguay': { 
    peopleGroupCount: 37, christianPercentage: 57.0, unreachedPercentage: 2.1, mainReligion: 'Irreligion/Christianity',
    missionsText: 'Uruguay is the most secular nation in South America. The church is small. Missions focus on pioneer church planting in a highly agnostic and skeptical society.',
    christianChallenges: 'Agnosticism and secularism are the dominant belief systems. People are educated, comfortable, and see no need for religion. The church is small and struggling to make an impact.',
    prayerIdeas: 'Pray for a spiritual awakening in Uruguay. Pray for creative and effective strategies for evangelism in a secular context. Pray for the small Uruguayan church to be strengthened.',
    supportLink: 'https://www.abwe.org/work/fields/uruguay',
  },
  'Venezuela': {
    peopleGroupCount: 114, christianPercentage: 88.0, unreachedPercentage: 4.1, mainReligion: 'Christianity',
    missionsText: 'A devastating and prolonged economic and political crisis has created a massive humanitarian disaster. The church is a primary source of hope and aid, ministering amidst hyperinflation, shortages, and despair.',
    christianChallenges: 'The overwhelming challenge is survival. Pastors and believers are suffering from hunger and lack of basic necessities. Many leaders have emigrated, leaving a leadership vacuum.',
    prayerIdeas: 'Pray for a political and economic resolution to the crisis. Pray for provision for the church to continue its compassionate ministry. Pray for strength and endurance for Venezuelan believers.',
    supportLink: 'https://www.samaritanspurse.org/our-ministry/venezuela-relief/',
  },
};

interface WorldMapProps {
  onViewProfile: (country: CountryFeature) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ onViewProfile }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<CountryFeatureCollection | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null);

  // Fetch map data once on component mount
  useEffect(() => {
    d3.json<WorldAtlasTopology>(WORLD_ATLAS_URL).then(topology => {
      if (topology) {
        const countries = topojson.feature(topology, topology.objects.countries) as CountryFeatureCollection;
        
        // Augment features with fact data
        countries.features.forEach((feature: CountryFeature) => {
            const countryName = feature.properties.name;
            const facts = countryFactsData[countryName];
            feature.properties.peopleGroupCount = facts?.peopleGroupCount ?? null;
            feature.properties.christianPercentage = facts?.christianPercentage ?? null;
            feature.properties.unreachedPercentage = facts?.unreachedPercentage ?? null;
            feature.properties.mainReligion = facts?.mainReligion ?? null;
            feature.properties.prayerIdeas = facts?.prayerIdeas ?? null;
            feature.properties.christianChallenges = facts?.christianChallenges ?? null;
            feature.properties.missionsText = facts?.missionsText ?? null;
            feature.properties.supportLink = facts?.supportLink ?? null;
        });

        setWorldData(countries);
      }
    }).catch(err => console.error("Error fetching world atlas data:", err));
  }, []);

  // Render and update map when data is available or container resizes
  useEffect(() => {
    if (!worldData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    
    let tooltip = d3.select(container).select<HTMLDivElement>('.map-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select(container)
            .append('div')
            .attr('class', 'map-tooltip')
            .style('position', 'absolute')
            .style('z-index', '20')
            .style('visibility', 'hidden')
            .style('background', 'rgba(17, 24, 39, 0.9)')
            .style('color', 'white')
            .style('padding', '0')
            .style('border-radius', '6px')
            .style('border', '1px solid hsl(210, 20%, 25%)')
            .style('font-size', '14px')
            .style('pointer-events', 'none')
            .style('min-width', '220px')
            .style('box-shadow', '0 4px 6px rgba(0,0,0,0.3)');
    }


    const renderMap = () => {
        svg.selectAll('*').remove();

        const { width, height } = container.getBoundingClientRect();
        
        svg.attr('width', width).attr('height', height);

        const projection = d3.geoMercator()
            .fitSize([width, height], worldData);

        const pathGenerator = d3.geoPath().projection(projection);
        const colorScale = d3.scaleSequential([0, 100], d3.interpolateRgbBasis(["#d6604d", "#f7f7f7", "#4393c3"]));
        const defaultColor = 'hsl(210, 15%, 40%)';
        const highlightColor = 'hsl(45, 100%, 50%)';

        const g = svg.append('g');

        g.selectAll('path')
            .data(worldData.features)
            .enter()
            .append('path')
            .attr('d', pathGenerator)
            .attr('fill', d => {
                const percentage = (d as CountryFeature).properties.christianPercentage;
                return percentage !== null ? colorScale(percentage) : defaultColor;
            }) 
            .attr('stroke', 'hsl(210, 20%, 15%)')
            .attr('stroke-width', 0.5)
            .style('cursor', 'pointer')
            .style('transition', 'fill 0.2s ease-in-out')
            .on('mouseover', function (event, d) {
                if (selectedCountry?.properties.name !== (d as CountryFeature).properties.name) {
                    d3.select(this).attr('fill', highlightColor);
                }
                const props = (d as CountryFeature).properties;
                const content = `
                    <div class="font-bold text-base p-2" style="background-color: hsl(210, 20%, 20%); border-top-left-radius: 5px; border-top-right-radius: 5px;">${props.name}</div>
                    <ul class="text-sm list-none p-2 space-y-1">
                        <li class="flex justify-between items-center">
                            <span class="text-gray-300">People Groups:</span>
                            <span class="font-semibold">${props.peopleGroupCount ?? 'N/A'}</span>
                        </li>
                        <li class="flex justify-between items-center">
                            <span class="text-gray-300">Christian %:</span>
                            <span class="font-semibold">${props.christianPercentage !== null ? props.christianPercentage + '%' : 'N/A'}</span>
                        </li>
                         <li class="flex justify-between items-center">
                            <span class="text-gray-300">Unreached %:</span>
                            <span class="font-semibold">${props.unreachedPercentage !== null ? props.unreachedPercentage + '%' : 'N/A'}</span>
                        </li>
                        <li class="flex justify-between items-center">
                            <span class="text-gray-300">Main Religion:</span>
                            <span class="font-semibold text-right">${props.mainReligion ?? 'N/A'}</span>
                        </li>
                    </ul>
                `;
                tooltip.style('visibility', 'visible').html(content);
            })
            .on('mousemove', function (event) {
                tooltip.style('top', (event.pageY + 15) + 'px').style('left', (event.pageX + 15) + 'px');
            })
            .on('mouseout', function (event, d) {
                if (selectedCountry?.properties.name !== (d as CountryFeature).properties.name) {
                    const props = (d as CountryFeature).properties;
                    const originalColor = props.christianPercentage !== null ? colorScale(props.christianPercentage) : defaultColor;
                    d3.select(this).attr('fill', originalColor);
                }
                tooltip.style('visibility', 'hidden');
            })
            .on('click', function (event, d) {
                event.stopPropagation();
                const clickedCountry = d as CountryFeature;
                setSelectedCountry(prev => 
                    prev?.properties.name === clickedCountry.properties.name ? null : clickedCountry
                );
            });

        const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 8]).on('zoom', (event) => {
            g.attr('transform', event.transform.toString());
        });

        svg.call(zoom).on('click', () => setSelectedCountry(null));
    };

    renderMap();
    
    const resizeObserver = new ResizeObserver(renderMap);
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [worldData]);

  // Effect to handle highlighting the selected country
  useEffect(() => {
    if (!svgRef.current || !worldData) return;
    const svg = d3.select(svgRef.current);
    const colorScale = d3.scaleSequential([0, 100], d3.interpolateRgbBasis(["#d6604d", "#f7f7f7", "#4393c3"]));
    const defaultColor = 'hsl(210, 15%, 40%)';

    svg.selectAll('path')
      .attr('fill', d => {
          const feature = d as CountryFeature;
          if (selectedCountry && feature.properties.name === selectedCountry.properties.name) {
              return 'hsl(45, 100%, 50%)'; // Selected color
          }
          const percentage = feature.properties.christianPercentage;
          return percentage !== null ? colorScale(percentage) : defaultColor;
      })
      .attr('stroke', d => 
          selectedCountry && (d as CountryFeature).properties.name === selectedCountry.properties.name
          ? 'hsl(45, 100%, 70%)'
          : 'hsl(210, 20%, 15%)'
      )
      .attr('stroke-width', d => 
          selectedCountry && (d as CountryFeature).properties.name === selectedCountry.properties.name
          ? 1.5
          : 0.5
      );
      
  }, [selectedCountry, worldData]);


  return (
    <div className="w-full h-full relative overflow-hidden">
        {/* Quick Fact Modal */}
        {selectedCountry && (
            <div
                className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
                onClick={() => setSelectedCountry(null)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="country-fact-title"
            >
                <div
                    className="bg-gray-800 text-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setSelectedCountry(null)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-light leading-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <h2 id="country-fact-title" className="text-2xl font-bold mb-6 border-b-2 border-gray-700 pb-2 break-words">{selectedCountry.properties.name}</h2>
                    <ul className="space-y-4 text-lg">
                        <li className="flex justify-between items-start">
                            <span className="text-gray-400 mr-4">People Groups</span>
                            <span className="font-semibold text-right">{selectedCountry.properties.peopleGroupCount ?? 'N/A'}</span>
                        </li>
                        <li className="flex justify-between items-start">
                            <span className="text-gray-400 mr-4">Christian %</span>
                            <span className="font-semibold text-right">{selectedCountry.properties.christianPercentage !== null ? selectedCountry.properties.christianPercentage + '%' : 'N/A'}</span>
                        </li>
                        <li className="flex justify-between items-start">
                            <span className="text-gray-400 mr-4">Unreached %</span>
                            <span className="font-semibold text-right">{selectedCountry.properties.unreachedPercentage !== null ? selectedCountry.properties.unreachedPercentage + '%' : 'N/A'}</span>
                        </li>
                        <li className="flex justify-between items-start">
                            <span className="text-gray-400 mr-4">Main Religion</span>
                            <span className="font-semibold text-right">{selectedCountry.properties.mainReligion ?? 'N/A'}</span>
                        </li>
                    </ul>
                    <div className="mt-8">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                            onClick={() => {
                                if (selectedCountry) {
                                    onViewProfile(selectedCountry);
                                }
                            }}
                        >
                            View Full Story
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Map Container */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
            <svg ref={svgRef} className="w-full h-full bg-gray-800" />
        </div>
    </div>
  );
};

export default WorldMap;