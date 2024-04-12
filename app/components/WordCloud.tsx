import React, { useEffect, useState } from 'react';
import { scaleLinear } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

interface Comment {
  ID: string,
  Title: string
  Post_Datetime: string,
  Comment: string,
  label: string,
  Post_URL: string,
  Score: number,
  Post_Author: string,
  Comment_Datetime: string,
  Comment_Author: string
}

interface WordData {
  text: string;
  value: number;
}

interface WordCloudProps {
  commentsData: Comment[];
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'of', 
 'for', 'with', 'by', 'as', 'from', 'into', 'through', 'over', 'under', 'above', 'below', 
 'between', 'among', 'within', 'without', 'about', 'before', 'after', 'during', 'since', 'until', 
 'while', 'throughout', 'up', 'down', 'off', 'out', 'around', 'across', 'along', 
 'behind', 'beneath', 'beside', 'over', 'inside', 'outside', 
 'underneath', 'be', 'is', 'you', 'yours', 'it', 'i', 'that', 'this', 'they', 'from', 'my', 'so', 'any',
'has', 'only', 'get','i', 'me', 'myself', 'we', 'our', 'ourselves', 'your', 'yours', 
'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'its', 
'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'these', 'those', 'am', 'are', 'was', 'were', 
'been', 'being', 'have', 'having', 'do', 'does', 'did', 'doing', 'but', 'if', 'because', 'until', 'how', 'all', 'both', 'each', 
'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
'same', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
];



function wordFreq(comments: Comment[]): WordData[] {
  const allText = comments.map(comment => comment.Comment).join(' ');
  const words: string[] = allText.replace(/[^\w\s]/g, '').split(/\s/).filter(Boolean);

  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!stopWords.includes(w.toLowerCase())) { // Exclude stop words
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  return 0;
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ commentsData }) => {
  const [words, setWords] = useState<WordData[]>([]);

  useEffect(() => {
    const wordData = wordFreq(commentsData);
    setWords(wordData);
  }, [commentsData]); // Update words state when commentsData changes

  const fontScale = scaleLinear({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  const fixedValueGenerator = () => 0.5;

  return (
    <div className="flex w-full bg-black h-full justify-center items-center">
      <Wordcloud
        words={words}
        width={500} // Set the width as a number instead of a string
        height={500}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={'archimedean'}
        rotate={getRotationDegree}
        random={fixedValueGenerator}>
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </text>
          ))
        }
      </Wordcloud>
    </div>
  );
};

export default WordCloudComponent;





