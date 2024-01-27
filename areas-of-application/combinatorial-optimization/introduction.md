# Combinatorial optimization

 Combinatorial optimization problems are tasks where one seeks an optimal solution among a finite set of possible candidates. In industrial settings, combinatorial optimization arises via scheduling, routing, resource allocation, supply chain management, and other logistics problems, where it can be difficult to find optimal solutions that obey various desired constraints. The field of operations research—which came to prominence after its application to logistics problems faced by WWII militaries—applies methods of combinatorial optimization (as well as [continuous optimization](../../areas-of-application/continuous-optimization/introduction.md#continuous-optimization)) to these problem areas for improved decision-making and efficiency in real-world problems.


Combinatorial optimization problems are also at the heart of classical theoretical computer science, where they are used to characterize and delineate complexity classes. Typical combinatorial optimization problems have limited structure to exploit, and therefore quantum computing most often only provides polynomial speedups. In fact, it came as a surprise in the early days of quantum computing research that for a wide variety of such problems quantum computers do offer up to quadratic speedups via Grover's search algorithm [@grover1996QSearch]. Subsequently, much effort was devoted to understanding how Grover's search and its generalization, [amplitude amplification](../../quantum-algorithmic-primitives/amplitude-amplification-and-estimation/amplitude-amplification.md#amplitude-amplification), offers speedups for various combinatorial optimization problems.


In this section, we cover several distinct approaches to solving combinatorial optimization problems. First, we look at combinatorial optimizations through its relation to [search problems](../../areas-of-application/combinatorial-optimization/search-algorithms-a-la-grover.md#search-algorithms-a-la-grover), where Grover's algorithm, or its generalizations, can be applied to give a quadratic or subquadratic speedup. Then, we cover several proposals—[variational algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) (viewed as an exact algorithm), [the adiabatic algorithm](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm), and the "short-path" algorithm [@hastings2018ShortPathQuantum; @dalzell2022mindthegap]—that have the potential to [surpass the quadratic speedup](../../areas-of-application/combinatorial-optimization/beyond-quadratic-speedups-in-exact-combinatorial-optimization.md#beyond-quadratic-speedups-in-exact-combinatorial-optimization) of Grover's algorithm. We discuss the (limited, but existing) evidence that these approaches could generate significant advantages, as well as the associated caveats.


We do not specifically cover the large body of work on quantum approaches for *approximate* combinatorial optimization (typically [variational quantum algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) or [quantum annealing](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm)). These algorithms usually translate the optimization problem to energy minimization of a spin system with a Hamiltonian that encodes the classical objective function. They apply some physically motivated heuristics to efficiently generate solutions that have low energy, and hopefully achieve a better objective value than could be generated classically in a comparable amount of time. An advantage of these approaches is that they are often more compatible with noisy near-term hardware. While approximate optimization remains an interesting direction, these quantum algorithms are heuristic and there is a general scarcity of concrete evidence that they will deliver practical advantages. 




